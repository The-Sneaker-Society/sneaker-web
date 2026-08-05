import { useParams } from "react-router-dom";
import { useSneakerMember } from "../../../context/MemberContext";
import { useGroupMembership } from "./useGroupMembership";
import { useGroupComposer } from "./useGroupComposer";
import { useGroupFeed } from "./useGroupFeed";
import { useGroupManagement } from "./useGroupManagement";

export const useNewGroupPage = () => {
  const { id } = useParams();
  const groupId = id;
  const skip = !groupId;

  const { member: currentUser, loading: currentUserLoading } =
    useSneakerMember();

  const membership = useGroupMembership({
    groupId,
    currentUser,
    skip,
  });

  const composer = useGroupComposer({
    groupId,
  });

  const feed = useGroupFeed({
    groupId,
    skip,
    isJoined: membership.isJoined,
  });

  const management = useGroupManagement({
    groupId,
    group: membership.group,
    skip,
  });

  return {
    currentUser,
    currentUserLoading,
    ...membership,
    ...composer,
    ...feed,
    ...management,
  };
};
