import { useEffect, useState } from "react";
import {
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Paper,
  IconButton,
  alpha,
  Skeleton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import useDashboardStore from "../store/useDataStore";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const {
    data,
    loading,
    fetchPaginatedData,
    addData,
    editData,
    deleteData,
    totalData,
  } = useDashboardStore();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // New field "item" (example) in case you need extra data
  const [formData, setFormData] = useState({
    name: "",
    dob: null,
    item: "",
  });

  useEffect(() => {
    // Convert zero-based page to 1-based for your backend
    fetchPaginatedData(paginationModel.page + 1, paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize, fetchPaginatedData]);

  // Format the data for DataGrid display
  const formattedData = data.map((item, index) => ({
    // 1-based row numbering
    id: paginationModel.page * paginationModel.pageSize + index + 1,
    ...item,
    dob: item.dob ? dayjs(item.dob).format("DD/MM/YYYY") : "N/A",
    age: item.age ? `${item.age} years` : "N/A",
  }));

  // Define DataGrid columns
  const columns = [
    { field: "id", headerName: "#", width: 80, headerAlign: "center", align: "center" },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150, headerAlign: "center", align: "center" },
    { field: "dob", headerName: "Date of Birth", flex: 1, minWidth: 120, headerAlign: "center", align: "center" },
    { field: "age", headerName: "Age", flex: 1, minWidth: 80, headerAlign: "center", align: "center" },
    { field: "item", headerName: "Item", flex: 1, minWidth: 140, headerAlign: "center", align: "center" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", width: "100%" }}>
          <IconButton
            size="small"
            onClick={() => {
              setEditing(params.row);
              setFormData({
                name: params.row.name,
                dob: params.row.dob === "N/A" ? null : dayjs(params.row.dob, "DD/MM/YYYY"),
                item: params.row.item || "",
              });
              setOpen(true);
            }}
            sx={{
              color: "primary.main",
              "&:hover": { backgroundColor: alpha("#1976d2", 0.1) },
            }}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={async () => {
              await deleteData(params.row._id);
              toast.success("🗑️ User deleted successfully!");
            }}
            disabled={loading}
            sx={{
              color: "error.main",
              "&:hover": { backgroundColor: alpha("#d32f2f", 0.1) },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!formData.name || !formData.dob) {
      toast.error("Name and Date of Birth are required");
      return;
    }
    const formattedDOB = formData.dob.format("YYYY-MM-DD");
    const dataToSubmit = {
      name: formData.name,
      dob: formattedDOB,
      item: formData.item,
    };

    try {
      if (editing) {
        await editData(editing._id, dataToSubmit);
        toast.success("User updated successfully!");
      } else {
        await addData(dataToSubmit);
        toast.success("User added successfully!");
      }
    } catch (error) {
      toast.error("Failed to save data.");
    } finally {
      setOpen(false);
      setEditing(null);
      setFormData({ name: "", dob: null, item: "" });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
        <Navbar />

        <Container sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper
            elevation={0}
            sx={{
              height: 650,
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {loading ? (
              /* 
                Table-like skeleton to mimic DataGrid columns/rows 
                (You can adjust the number of rows and Skeleton widths)
              */
              <Box sx={{ width: "100%", height: "100%", p: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Date of Birth</TableCell>
                      <TableCell>Age</TableCell>
                      <TableCell>Item</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton variant="text" width={20} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="60%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="80%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="50%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="text" width="70%" />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant="rectangular" width={50} height={30} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              // Actual DataGrid when not loading
              <DataGrid
                rows={formattedData}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={totalData}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[20, 50, 100]}
                disableRowSelectionOnClick
              />
            )}
          </Paper>
        </Container>

        {/* Dialog for Add/Edit */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mt: 2 }}
            />
            <DatePicker
              label="Date of Birth"
              value={formData.dob}
              onChange={(newValue) => setFormData({ ...formData, dob: newValue })}
              sx={{ mt: 2, width: "100%" }}
              format="DD/MM/YYYY"
              disableFuture
            />
            <TextField
              margin="normal"
              fullWidth
              label="Item"
              value={formData.item}
              onChange={(e) => setFormData({ ...formData, item: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" disabled={loading}>
              {loading ? "Loading..." : editing ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default Dashboard;
