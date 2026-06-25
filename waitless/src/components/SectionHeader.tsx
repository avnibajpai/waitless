import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  eyebrow?: string;
  title: string;
  action?: string;
};

export function SectionHeader({ eyebrow, title, action }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {action ? <Text style={styles.action}>{action}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 12
  },
  copy: {
    flex: 1
  },
  eyebrow: {
    color: colors.coral,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase",
    marginBottom: 4
  },
  title: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800"
  },
  action: {
    color: colors.mint,
    fontSize: 13,
    fontWeight: "800"
  }
});
