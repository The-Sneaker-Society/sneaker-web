import { keyframes } from "@mui/system";

export const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const cleanOff = keyframes`
  0%, 30% { opacity: 1; filter: sepia(0.7) saturate(2.5) brightness(0.65); }
  100% { opacity: 0; filter: none; }
`;

export const fadeStain = keyframes`
  0%, 15% { opacity: 1; }
  100% { opacity: 0; }
`;
