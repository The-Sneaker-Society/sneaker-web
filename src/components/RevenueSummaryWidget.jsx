import React, { useState } from "react";
import { Box, Typography, Tooltip } from "@mui/material";
import { useQuery, gql } from "@apollo/client";
import { useColors } from "../theme/colors";
import { FiInbox, FiCheckCircle, FiDollarSign } from "react-icons/fi";

const GET_REVENUE_SUMMARY = gql`
  query GetRevenueSummary {
    revenueSummary {
      months {
        month
        revenue
        newContracts
        completed
      }
      percentChange
    }
  }
`;

const CHART_HEIGHT = 90;

function StatRow({ icon: Icon, label, value, color }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, opacity: 0.75 }}>
        <Icon size={11} color={color} />
        <Typography sx={{ fontSize: "0.68rem", color, fontWeight: 500 }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: "0.72rem", color, fontWeight: 700 }}>{value}</Typography>
    </Box>
  );
}

function BarTooltipContent({ d }) {
  return (
    <Box sx={{ p: "4px 2px", minWidth: 155 }}>
      <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", mb: 0.75, color: "inherit" }}>
        {d.month}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <StatRow icon={FiDollarSign}    label="Revenue"        value={`$${d.revenue.toLocaleString()}`} color="inherit" />
        <StatRow icon={FiInbox}         label="New contracts"  value={d.newContracts}                   color="inherit" />
        <StatRow icon={FiCheckCircle}   label="Completed"      value={d.completed}                      color="inherit" />
      </Box>
    </Box>
  );
}

function SvgBarChart({ data, colors }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const max = Math.max(...data.map((d) => d.revenue));
  const gap = 8;
  const totalGaps = gap * (data.length - 1);
  const barWidthPct = `calc((100% - ${totalGaps}px) / ${data.length})`;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: `${gap}px`, height: `${CHART_HEIGHT}px`, width: "100%" }}>
      {data.map((d, i) => {
        const heightPct = (d.revenue / max) * 100;
        const isLast = i === data.length - 1;
        const isHovered = hoveredIndex === i;
        const isFaded = hoveredIndex !== null && !isHovered;

        const baseColor = isLast
          ? colors.textPrimary
          : colors.isDark
          ? "rgba(255,255,255,0.25)"
          : "rgba(0,0,0,0.15)";

        const hoveredColor = colors.isDark
          ? "rgba(255,255,255,0.85)"
          : "rgba(0,0,0,0.8)";

        const fadedColor = colors.isDark
          ? "rgba(255,255,255,0.1)"
          : "rgba(0,0,0,0.07)";

        const barColor = isHovered ? hoveredColor : isFaded ? fadedColor : baseColor;

        return (
          <Tooltip
            key={d.month}
            title={<BarTooltipContent d={d} />}
            placement="top"
            arrow
            enterDelay={0}
            leaveDelay={0}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: colors.isDark ? "#1e1e1e" : "#ffffff",
                  color: colors.textPrimary,
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: 2,
                  boxShadow: colors.isDark
                    ? "0 4px 20px rgba(0,0,0,0.5)"
                    : "0 4px 20px rgba(0,0,0,0.12)",
                  px: 1.5,
                  py: 1,
                },
              },
              arrow: {
                sx: {
                  color: colors.isDark ? "#1e1e1e" : "#ffffff",
                  "&::before": { border: `1px solid ${colors.borderSubtle}` },
                },
              },
            }}
          >
            <Box
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              sx={{
                width: barWidthPct,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                cursor: "default",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: `${heightPct}%`,
                  borderRadius: "3px 3px 0 0",
                  bgcolor: barColor,
                  transition: "background-color 0.15s ease, transform 0.15s ease",
                  transform: isHovered ? "scaleY(1.04)" : "scaleY(1)",
                  transformOrigin: "bottom",
                }}
              />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

export default function RevenueSummaryWidget() {
  const colors = useColors();
  const { data, loading } = useQuery(GET_REVENUE_SUMMARY);

  if (loading) {
    return (
      <Box sx={{ width: "100%", height: "100%", borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, bgcolor: colors.widgetBg, p: 2.5, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Box sx={{ height: 12, width: "40%", borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", mb: 0.5 }} />
          <Box sx={{ height: 24, width: "25%", borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", mb: 1.5 }} />
        </Box>
        <Box sx={{ height: CHART_HEIGHT, borderRadius: 1, bgcolor: colors.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
      </Box>
    );
  }

  const summary = data?.revenueSummary;
  const months = summary?.months ?? [];
  const percentChange = summary?.percentChange ?? 0;
  const isEmpty = months.length === 0 || months.every((m) => m.revenue === 0);

  const latestRev = !isEmpty ? months[months.length - 1]?.revenue : 0;
  const formattedRev = latestRev ? `$${latestRev.toLocaleString()}` : "$0";

  return (
    <Box sx={{ width: "100%", height: "100%", borderRadius: 3, border: `1px solid ${colors.borderSubtle}`, bgcolor: colors.widgetBg, p: 2.5, boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      {!isEmpty && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: colors.textSecondary, mb: 0.25 }}>
              Analytics · This Month
            </Typography>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: colors.textPrimary, lineHeight: 1.1 }}>
              {formattedRev}
            </Typography>
          </Box>
          <Box sx={{ px: 1.25, py: 0.5, borderRadius: 5, border: `1px solid ${colors.borderSubtle}`, bgcolor: colors.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}>
            <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: percentChange >= 0 ? colors.status.completed : colors.status.error }}>
              {percentChange >= 0 ? "+" : ""}{percentChange}%
            </Typography>
          </Box>
        </Box>
      )}

      {/* Body */}
      {isEmpty ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", py: 2 }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: colors.textPrimary, mb: 0.5 }}>
            No analytics to show yet
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: colors.textSecondary, maxWidth: 280, lineHeight: 1.4 }}>
            Once contracts start coming in and payments begin rolling, this is where you'll see it all — your revenue climbing, trends emerging, and your business growing at a glance.
          </Typography>
        </Box>
      ) : (
        <>
          <SvgBarChart data={months} colors={colors} />
          <Box sx={{ display: "flex", gap: "8px", mt: 0.75 }}>
            {months.map((d) => (
              <Box key={d.month} sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <Typography sx={{ fontSize: "0.65rem", color: colors.textSecondary, fontWeight: 500 }}>
                  {d.month}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
