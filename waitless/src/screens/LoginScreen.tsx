import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
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
import { demoAccounts } from "../data/auth";
import { useApp } from "../context/AppContext";
import { colors, cardShadow } from "../theme/colors";

export function LoginScreen() {
  const { signIn, isLoading, authError } = useApp();
  const [email, setEmail] = useState("demo@waltless.com");
  const [password, setPassword] = useState("Demo123!");

  const handleSignIn = async () => {
    await signIn(email, password);
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
              <Ionicons name="time-outline" size={34} color="#FFFFFF" />
            </View>
            <Text style={styles.brand}>wAltless</Text>
            <Text style={styles.tagline}>
              Skip the line. We'll text when it's your turn.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="demo@waltless.com"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            {authError ? (
              <Text style={styles.error}>{authError}</Text>
            ) : null}

            <Pressable
              onPress={handleSignIn}
              disabled={isLoading}
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signInText}>Sign in</Text>
              )}
            </Pressable>

            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>Create an account</Text>
            </Pressable>
          </View>

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo accounts</Text>
            {demoAccounts.map((account) => (
              <Pressable
                key={account.email}
                onPress={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
                style={styles.demoRow}
              >
                <Text style={styles.demoText}>
                  {account.label}: {account.email} / {account.password}
                </Text>
              </Pressable>
            ))}
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
    paddingVertical: 32,
    justifyContent: "center"
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: 28
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
    lineHeight: 22,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 280
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.line,
    ...cardShadow
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 8
  },
  labelSpacing: {
    marginTop: 16
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.ink
  },
  error: {
    marginTop: 12,
    color: colors.coral,
    fontSize: 14,
    fontWeight: "600"
  },
  signInButton: {
    marginTop: 22,
    backgroundColor: colors.mint,
    borderRadius: 14,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonDisabled: {
    opacity: 0.7
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800"
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center"
  },
  linkText: {
    color: colors.blue,
    fontSize: 15,
    fontWeight: "600"
  },
  demoBox: {
    marginTop: 24,
    backgroundColor: colors.mintSoft,
    borderRadius: 16,
    padding: 18,
    gap: 8
  },
  demoTitle: {
    color: colors.mintDark,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 4
  },
  demoRow: {
    paddingVertical: 2
  },
  demoText: {
    color: colors.mintDark,
    fontSize: 13,
    lineHeight: 20
  }
});
