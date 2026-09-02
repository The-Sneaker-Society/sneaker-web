import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Switch,
  Paper,
  Alert,
} from "@mui/material";
import { gql, useQuery, useMutation } from "@apollo/client";

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

const emptyItem = (sortOrder) => ({
  id: "",
  name: "",
  price: "",
  description: "",
  isActive: true,
  sortOrder,
});

const ServiceMenuEditor = () => {
  const { data, loading, error } = useQuery(GET_SERVICE_MENU, { fetchPolicy: "cache-and-network" });
  const [upsertServiceMenu, { loading: saving }] = useMutation(UPSERT_SERVICE_MENU, {
    update(cache, { data: mutationData }) {
      if (mutationData?.upsertServiceMenu) {
        cache.modify({
          fields: {
            currentMember(existing) {
              return existing;
            },
          },
        });
      }
    },
  });

  const [items, setItems] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data?.currentMember?.serviceMenu) {
      const sorted = [...data.currentMember.serviceMenu].sort((a, b) => a.sortOrder - b.sortOrder);
      setItems(sorted);
    }
  }, [data]);

  const handleChange = (idx, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  };

  const handleAdd = () => {
    if (items.length >= 12) return;
    setItems((prev) => [...prev, emptyItem(prev.length)]);
  };

  const handleRemove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sortOrder: i })));
  };

  const move = (idx, dir) => {
    const newItems = [...items];
    const target = idx + dir;
    if (target < 0 || target >= newItems.length) return;
    const [moved] = newItems.splice(idx, 1);
    newItems.splice(target, 0, moved);
    newItems.forEach((it, i) => (it.sortOrder = i));
    setItems(newItems);
  };

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(false);
    // validate
    if (items.length > 12) {
      setSaveError("Maximum 12 items allowed.");
      return;
    }
    for (const it of items) {
      if (!it.name || !it.name.trim()) {
        setSaveError("Name is required for all items.");
        return;
      }
      if (it.name.length > 60) {
        setSaveError("Name must be 60 characters or less.");
        return;
      }
      const priceNum = Number(it.price);
      if (!Number.isFinite(priceNum) || priceNum < 1 || priceNum > 500) {
        setSaveError("Price must be between $1 and $500.");
        return;
      }
      if (it.description && it.description.length > 200) {
        setSaveError("Description must be 200 characters or less.");
        return;
      }
    }
    const payload = items.map((it, idx) => ({
      id: it.id || undefined,
      name: it.name.trim(),
      price: Number(it.price),
      description: it.description || "",
      isActive: Boolean(it.isActive),
      sortOrder: idx,
    }));
    try {
      await upsertServiceMenu({ variables: { items: payload } });
      setSaveSuccess(true);
    } catch (e) {
      setSaveError(e.message);
    }
  };

  if (loading) return <Typography>Loading menu...</Typography>;
  if (error) return <Alert severity="error">Failed to load menu: {error.message}</Alert>;

  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>
        Service Menu
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Define up to 12 services. Clients will see active items as options, with fallback to custom request.
      </Typography>

      {items.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          No menu yet — clients will see classic form.
        </Alert>
      ) : null}

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
            <TableRow key={idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <TextField
                  value={it.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                  size="small"
                  placeholder="e.g. Basic Clean"
                  inputProps={{ maxLength: 60 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={it.price}
                  onChange={(e) => handleChange(idx, "price", e.target.value)}
                  size="small"
                  type="number"
                  inputProps={{ min: 1, max: 500, step: 0.01 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={it.description}
                  onChange={(e) => handleChange(idx, "description", e.target.value)}
                  size="small"
                  placeholder="Optional"
                  inputProps={{ maxLength: 200 }}
                />
              </TableCell>
              <TableCell>
                <Switch checked={Boolean(it.isActive)} onChange={(e) => handleChange(idx, "isActive", e.target.checked)} />
              </TableCell>
              <TableCell>
                <Box display="flex" gap={0.5}>
                  <Button size="small" disabled={idx === 0} onClick={() => move(idx, -1)}>
                    ↑
                  </Button>
                  <Button size="small" disabled={idx === items.length - 1} onClick={() => move(idx, 1)}>
                    ↓
                  </Button>
                </Box>
              </TableCell>
              <TableCell>
                <Button size="small" color="error" onClick={() => handleRemove(idx)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box display="flex" gap={1} mt={2} flexWrap="wrap">
        <Button variant="outlined" onClick={handleAdd} disabled={items.length >= 12}>
          Add Service {items.length >= 12 ? "(max 12)" : ""}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Menu"}
        </Button>
      </Box>
      {saveError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {saveError}
        </Alert>
      )}
      {saveSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Menu saved.
        </Alert>
      )}
    </Paper>
  );
};

export default ServiceMenuEditor;
