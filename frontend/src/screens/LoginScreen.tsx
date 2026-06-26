import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { colors, cardShadow } from "../theme/colors";

type Props = {
  onCreateAccount: () => void;
};

export function LoginScreen({ onCreateAccount }: Props) {
  const { signIn } = useApp();
  const [email, setEmail] = useState("demo@waltless.com");
  const [password, setPassword] = useState("Demo123!");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    const ok = signIn(email.trim(), password);
    if (!ok) {
      setError("Invalid email or password.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <View style={styles.logo}>
              <Ionicons name="time-outline" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.brand}>wAltless</Text>
            <Text style={styles.tagline}>
              Skip the line. We'll text when it's your turn.
            </Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={[styles.label, styles.labelSpaced]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInText}>Sign in</Text>
            </Pressable>

            <Pressable onPress={onCreateAccount} style={styles.linkWrap}>
              <Text style={styles.link}>Create an account</Text>
            </Pressable>
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo accounts</Text>
            <Text style={styles.demoLine}>
              Consumer: demo@waltless.com / Demo123!
            </Text>
            <Text style={styles.demoLine}>
              Staff: staff@waltless.com / Staff123!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper
  },
  flex: {
    flex: 1
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 36
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16
  },
  brand: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5
  },
  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280
  },
  formCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 20,
    ...cardShadow
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 8
  },
  labelSpaced: {
    marginTop: 16
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 12
  },
  signInButton: {
    marginTop: 20,
    backgroundColor: colors.mint,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center"
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700"
  },
  linkWrap: {
    marginTop: 16,
    alignItems: "center"
  },
  link: {
    color: colors.blue,
    fontSize: 14,
    fontWeight: "600"
  },
  demoBox: {
    marginTop: 24,
    backgroundColor: colors.mintSoft,
    borderRadius: 14,
    padding: 18
  },
  demoTitle: {
    color: colors.mint,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8
  },
  demoLine: {
    color: colors.mint,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "500"
  }
});
