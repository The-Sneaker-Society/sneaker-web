import { Stack } from "@mui/material";
import GroupAboutSection from "./GroupAboutSection";
import GroupMembersPanel from "./GroupMembersPanel";

const GroupSidebar = ({ group, memberCount, adminIds }) => {
  return (
    <Stack spacing={2.25}>
      <GroupAboutSection group={group} memberCount={memberCount} />
      <GroupMembersPanel group={group} adminIds={adminIds} />
    </Stack>
  );
};

export default GroupSidebar;