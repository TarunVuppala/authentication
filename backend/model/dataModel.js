import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            immutable: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [100, 'Name must not exceed 100 characters'],
            match: [/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'],
        },
        dob: {
            type: Date,
            required: [true, 'Date of birth is required'],
            validate: {
                validator: function (value) {
                    return value < new Date();
                },
                message: 'Date of birth cannot be in the future',
            },
        },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

DataSchema.virtual('age').get(function () {
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

const Data = mongoose.model('Data', DataSchema);
export default Data;
