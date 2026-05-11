import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_GROUP, JOIN_GROUP, LEAVE_GROUP } from "../graphql";

export const useGroupMembership = ({ groupId, currentUser, skip }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [joinLeaveError, setJoinLeaveError] = useState("");

  const {
    data,
    loading,
    error,
    refetch: refetchGroup,
  } = useQuery(GET_GROUP, {
    variables: { id: groupId },
    skip,
  });

  const group = data?.getGroup;

  const isJoined = useMemo(() => {
    if (!currentUser?.id || !group?.members) return false;
    return group.members.some((member) => member.id === currentUser.id);
  }, [group, currentUser]);

  const isCreator = useMemo(() => {
    if (!currentUser?.id || !group?.createdBy?.id) return false;
    return group.createdBy.id === currentUser.id;
  }, [group, currentUser]);

  const isGroupAdmin = useMemo(() => {
    if (!currentUser?.id || !group?.admins) return false;
    return group.admins.some((admin) => admin.id === currentUser.id);
  }, [group, currentUser]);

  const canManageGroup = isCreator || isGroupAdmin;
  const memberCount = group?.members?.length || 0;
  const adminCount = group?.admins?.length || 0;
  const adminIds = useMemo(
    () => new Set((group?.admins || []).map((admin) => admin.id)),
    [group],
  );

  const [joinGroup, { loading: joining }] = useMutation(JOIN_GROUP, {
    refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onCompleted: () => setJoinLeaveError(""),
    onError: (err) => setJoinLeaveError(err.message),
  });

  const [leaveGroup, { loading: leaving }] = useMutation(LEAVE_GROUP, {
    refetchQueries: [{ query: GET_GROUP, variables: { id: groupId } }],
    awaitRefetchQueries: true,
    onCompleted: () => setJoinLeaveError(""),
    onError: (err) => setJoinLeaveError(err.message),
  });

  const handleJoinGroup = () => {
    if (!groupId) return;
    setJoinLeaveError("");
    joinGroup({ variables: { groupId } });
  };

  const handleLeaveGroup = () => {
    if (!groupId) return;
    setJoinLeaveError("");
    setModalOpen(false);
    leaveGroup({ variables: { groupId } });
  };

  return {
    loading,
    error,
    group,
    isJoined,
    isCreator,
    isGroupAdmin,
    canManageGroup,
    memberCount,
    adminCount,
    adminIds,
    modalOpen,
    setModalOpen,
    isHovering,
    setIsHovering,
    joinLeaveError,
    joining,
    leaving,
    handleJoinGroup,
    handleLeaveGroup,
    refetchGroup,
  };
};
