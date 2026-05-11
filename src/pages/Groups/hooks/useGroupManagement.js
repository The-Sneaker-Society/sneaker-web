import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { DELETE_GROUP, GET_GROUP, UPDATE_GROUP } from "../graphql";

export const useGroupManagement = ({ groupId, group, skip }) => {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteGroupModalOpen, setDeleteGroupModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editGroupError, setEditGroupError] = useState("");
  const [deleteGroupError, setDeleteGroupError] = useState("");

  useEffect(() => {
    if (!editModalOpen || !group) return;
    setEditName(group.name || "");
    setEditDescription(group.description || "");
    setEditAvatar(group.avatar || "");
  }, [editModalOpen, group]);

  const [updateGroup, { loading: updatingGroup }] = useMutation(UPDATE_GROUP, {
    refetchQueries: skip
      ? []
      : [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      setEditGroupError("");
      setEditModalOpen(false);
    },
    onError: (err) => setEditGroupError(err.message),
  });

  const [deleteGroup, { loading: deletingGroup }] = useMutation(DELETE_GROUP, {
    onCompleted: () => {
      setDeleteGroupError("");
      setDeleteGroupModalOpen(false);
      navigate("/groups");
    },
    onError: (err) => setDeleteGroupError(err.message),
  });

  const openEditGroupModal = () => {
    if (!group) return;
    setEditName(group.name || "");
    setEditDescription(group.description || "");
    setEditAvatar(group.avatar || "");
    setEditGroupError("");
    setEditModalOpen(true);
  };

  const handleUpdateGroup = async (event) => {
    event?.preventDefault?.();

    if (!groupId) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setEditGroupError("Group name cannot be empty.");
      return;
    }

    setEditGroupError("");

    try {
      await updateGroup({
        variables: {
          id: groupId,
          name: trimmedName,
          description: editDescription.trim(),
          avatar: editAvatar.trim(),
        },
      });
    } catch {}
  };

  const openDeleteGroupModal = () => {
    setDeleteGroupError("");
    setDeleteGroupModalOpen(true);
  };

  const handleDeleteGroup = async () => {
    if (!groupId) return;
    setDeleteGroupError("");

    try {
      await deleteGroup({ variables: { id: groupId } });
    } catch {}
  };

  return {
    editModalOpen,
    setEditModalOpen,
    deleteGroupModalOpen,
    setDeleteGroupModalOpen,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editAvatar,
    setEditAvatar,
    editGroupError,
    deleteGroupError,
    updatingGroup,
    deletingGroup,
    openEditGroupModal,
    handleUpdateGroup,
    openDeleteGroupModal,
    handleDeleteGroup,
  };
};
