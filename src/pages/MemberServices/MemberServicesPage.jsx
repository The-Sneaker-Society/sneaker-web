import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Switch,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiList, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiExternalLink } from "react-icons/fi";
import { useColors } from "../../theme/colors";

const GET_SERVICE_MENU = gql`
  query GetServiceMenu {
    currentMember {
      id
      serviceMenu {
        id
        name
        price
        description
        isActive
        sortOrder
      }
    }
  }
`;

const UPSERT_SERVICE_MENU = gql`
  mutation UpsertServiceMenu($items: [ServiceMenuItemInput!]!) {
    upsertServiceMenu(items: $items) {
      id
      name
      price
      description
      isActive
      sortOrder
    }
  }
`;

function ServiceCard({ item, idx, total, colors, onEdit, onDelete, onToggleActive, onMove }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${colors.borderSubtle}`,
        bgcolor: colors.widgetBg,
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
        minHeight: 150,
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": { borderColor: colors.borderSecondary, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
        <Typography fontWeight={700} sx={{ fontSize: "1rem", lineHeight: 1.3, flex: 1, pr: 1 }}>
          {item.name}
        </Typography>
        <Chip
          label={`$${item.price}`}
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            color: colors.textPrimary,
            border: `1px solid ${colors.borderSubtle}`,
          }}
        />
      </Box>
      {item.description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.6em",
            lineHeight: 1.4,
          }}
        >
          {item.description}
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", minHeight: "2.6em" }}>
          No description
        </Typography>
      )}
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5} flexWrap="wrap" gap={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: item.isActive ? "#2ECC71" : "#aaa",
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" fontWeight={600} color={item.isActive ? "text.primary" : "text.secondary"}>
            {item.isActive ? "Active" : "Inactive"}
          </Typography>
          <Switch
            size="small"
            checked={Boolean(item.isActive)}
            onChange={() => onToggleActive(idx)}
            inputProps={{ "aria-label": "Active" }}
          />
        </Box>
        <Box display="flex" gap={0.5} alignItems="center">
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(idx)} sx={{ border: `1px solid ${colors.borderSubtle}` }}>
              <FiEdit2 size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(idx)} sx={{ border: `1px solid ${colors.borderSubtle}` }}>
              <FiTrash2 size={14} />
            </IconButton>
          </Tooltip>
          <Box display="flex" flexDirection="column" ml={0.5}>
            <IconButton size="small" disabled={idx === 0} onClick={() => onMove(idx, -1)} sx={{ p: 0.3 }}>
              <FiChevronUp size={14} />
            </IconButton>
            <IconButton size="small" disabled={idx === total - 1} onClick={() => onMove(idx, 1)} sx={{ p: 0.3 }}>
              <FiChevronDown size={14} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function MemberServicesPage() {
  const colors = useColors();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem("serviceMenuView") || "grid";
    } catch {
      return "grid";
    }
  });
  const { data, loading, error, refetch } = useQuery(GET_SERVICE_MENU, { fetchPolicy: "cache-and-network" });
  const [upsertServiceMenu, { loading: saving }] = useMutation(UPSERT_SERVICE_MENU);

  const [items, setItems] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", isActive: true });
  const [formError, setFormError] = useState(null);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState(null);

  useEffect(() => {
    if (data?.currentMember?.serviceMenu) {
      const sorted = [...data.currentMember.serviceMenu].sort((a, b) => a.sortOrder - b.sortOrder);
      setItems(sorted);
    }
  }, [data]);

  const persistView = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem("serviceMenuView", mode);
    } catch {
      // ignore
    }
  };

  const activeCount = items.filter((i) => i.isActive).length;

  const validateForm = () => {
    if (!form.name || !form.name.trim()) return "Name is required.";
    if (form.name.trim().length > 60) return "Name must be 60 characters or less.";
    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum < 1 || priceNum > 500) return "Price must be between $1 and $500.";
    if (form.description && form.description.length > 200) return "Description must be 200 characters or less.";
    return null;
  };

  const buildPayload = (nextItems) =>
    nextItems.map((it, idx) => ({
      id: it.id || undefined,
      name: String(it.name).trim(),
      price: Number(it.price),
      description: it.description || "",
      isActive: Boolean(it.isActive),
      sortOrder: idx,
    }));

  const handlePersist = async (nextItems) => {
    setSaveError(null);
    setSaveSuccess(false);
    if (nextItems.length > 12) {
      setSaveError("Maximum 12 items allowed.");
      return false;
    }
    const payload = buildPayload(nextItems);
    try {
      const res = await upsertServiceMenu({ variables: { items: payload } });
      if (res?.data?.upsertServiceMenu) {
        const sorted = [...res.data.upsertServiceMenu].sort((a, b) => a.sortOrder - b.sortOrder);
        setItems(sorted);
      } else {
        setItems(nextItems.map((it, idx) => ({ ...it, sortOrder: idx })));
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      return true;
    } catch (e) {
      setSaveError(e.message);
      return false;
    }
  };

  const openAdd = () => {
    if (items.length >= 12) return;
    setEditingIdx(null);
    setForm({ name: "", price: "", description: "", isActive: true });
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (idx) => {
    const it = items[idx];
    setEditingIdx(idx);
    setForm({ name: it.name, price: String(it.price), description: it.description || "", isActive: Boolean(it.isActive) });
    setFormError(null);
    setFormOpen(true);
  };

  const handleFormSave = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    let nextItems;
    if (editingIdx === null) {
      nextItems = [...items, { id: "", name: form.name.trim(), price: form.price, description: form.description, isActive: form.isActive, sortOrder: items.length }];
    } else {
      nextItems = items.map((it, i) => (i === editingIdx ? { ...it, name: form.name.trim(), price: form.price, description: form.description, isActive: form.isActive } : it));
    }
    const ok = await handlePersist(nextItems);
    if (ok) setFormOpen(false);
  };

  const handleDelete = async (idx) => {
    setDeleteConfirmIdx(idx);
  };

  const confirmDelete = async () => {
    if (deleteConfirmIdx === null) return;
    const next = items.filter((_, i) => i !== deleteConfirmIdx).map((it, i) => ({ ...it, sortOrder: i }));
    await handlePersist(next);
    setDeleteConfirmIdx(null);
  };

  const handleToggleActive = async (idx) => {
    const next = items.map((it, i) => (i === idx ? { ...it, isActive: !it.isActive } : it));
    // optimistic
    setItems(next);
    await handlePersist(next);
  };

  const handleMove = async (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(idx, 1);
    next.splice(target, 0, moved);
    next.forEach((it, i) => (it.sortOrder = i));
    setItems(next);
    await handlePersist(next);
  };

  if (loading) return <Box p={3}><Typography>Loading menu...</Typography></Box>;
  if (error) return <Box p={3}><Alert severity="error">Failed to load menu: {error.message}</Alert></Box>;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", p: { xs: 2, sm: 3 }, width: "100%" }}>
      {/* Header */}
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="flex-start" gap={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Service Menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Up to 12 services — shown at intake, Custom Request always appended
          </Typography>
          <Box display="flex" gap={2} alignItems="center" mt={1}>
            <Chip label={`Active: ${activeCount}/12`} size="small" sx={{ fontWeight: 600 }} />
            <Button size="small" endIcon={<FiExternalLink size={14} />} onClick={() => navigate("/member/preview-contract")}>
              Preview Intake
            </Button>
          </Box>
        </Box>
        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Box
            sx={{
              display: "flex",
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Button
              size="small"
              startIcon={<FiGrid size={14} />}
              onClick={() => persistView("grid")}
              variant={viewMode === "grid" ? "contained" : "text"}
              sx={{ borderRadius: 0, minWidth: 80 }}
            >
              Grid
            </Button>
            <Button
              size="small"
              startIcon={<FiList size={14} />}
              onClick={() => persistView("list")}
              variant={viewMode === "list" ? "contained" : "text"}
              sx={{ borderRadius: 0, minWidth: 80 }}
            >
              List
            </Button>
          </Box>
          <Button variant="contained" onClick={openAdd} disabled={items.length >= 12 || saving}>
            Add Service {items.length >= 12 ? "(max 12)" : ""}
          </Button>
        </Box>
      </Box>

      {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
      {saveSuccess && <Alert severity="success" sx={{ mb: 2 }}>Menu saved.</Alert>}

      {items.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No services yet — add one to show at intake. Clients will see classic form until you add services.
        </Alert>
      ) : null}

      {/* Grid view */}
      {viewMode === "grid" ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
          {items.map((it, idx) => (
            <ServiceCard
              key={it.id || idx}
              item={it}
              idx={idx}
              total={items.length}
              colors={colors}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onMove={handleMove}
            />
          ))}
        </Box>
      ) : (
        /* List view */
        <Paper variant="outlined" sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Price ($)</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((it, idx) => (
                <TableRow key={it.id || idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{it.name}</TableCell>
                  <TableCell>
                    <Chip label={`$${it.price}`} size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {it.description || <Typography variant="caption" color="text.secondary" fontStyle="italic">—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Switch checked={Boolean(it.isActive)} onChange={() => handleToggleActive(idx)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <Button size="small" disabled={idx === 0} onClick={() => handleMove(idx, -1)}>↑</Button>
                      <Button size="small" disabled={idx === items.length - 1} onClick={() => handleMove(idx, 1)}>↓</Button>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5}>
                      <Button size="small" onClick={() => openEdit(idx)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(idx)}>Delete</Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingIdx === null ? "Add Service" : "Edit Service"}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              inputProps={{ maxLength: 60 }}
              helperText={`${form.name.length}/60`}
              fullWidth
              required
            />
            <TextField
              label="Price ($)"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              type="number"
              inputProps={{ min: 1, max: 500, step: 0.01 }}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              inputProps={{ maxLength: 200 }}
              helperText={`${form.description.length}/200`}
              fullWidth
              multiline
              rows={3}
              placeholder="Optional"
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Switch checked={Boolean(form.isActive)} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
              <Typography variant="body2">{form.isActive ? "Active — shown at intake" : "Inactive — hidden"}</Typography>
            </Box>
            {formError && <Alert severity="error">{formError}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleFormSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteConfirmIdx !== null} onClose={() => setDeleteConfirmIdx(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete service?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This will remove "{deleteConfirmIdx !== null ? items[deleteConfirmIdx]?.name : ""}" from your menu.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmIdx(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={saving}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
