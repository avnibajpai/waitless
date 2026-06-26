import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, shadow } from "../theme/colors";

type Props = {
  label: string;
  value: string;
  tone?: "mint" | "blue" | "gold" | "coral";
  icon?: ReactNode;
};

const toneMap = {
  mint: { bg: colors.mintSoft, fg: colors.mint },
  blue: { bg: colors.blueSoft, fg: colors.blue },
  gold: { bg: colors.goldSoft, fg: colors.gold },
  coral: { bg: colors.coralSoft, fg: colors.coral }
};

export function MetricCard({ label, value, tone = "mint", icon }: Props) {
  const toneColors = toneMap[tone];

  return (
    <View style={styles.card}>
      <View style={[styles.icon, { backgroundColor: toneColors.bg }]}>
        {icon}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 142,
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    ...shadow
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  value: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800"
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4
  }
});
