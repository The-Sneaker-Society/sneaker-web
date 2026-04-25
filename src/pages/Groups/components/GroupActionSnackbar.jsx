import { Stack } from "@mui/material";
import GroupAboutSection from "./GroupAboutSection";
import GroupMembersPanel from "./GroupMembersPanel";

const GroupSidebar = ({ group, memberCount = 0, adminIds = new Set() }) => {
  return (
    <Stack spacing={2}>
      <GroupAboutSection group={group} memberCount={memberCount} />
      <GroupMembersPanel members={group?.members || []} adminIds={adminIds} />
    </Stack>
  );
};

export default GroupSidebar;