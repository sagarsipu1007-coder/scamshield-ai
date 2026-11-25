import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Bot, Sparkles, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { Card } from '@/components/ui/Card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMessage, setTyping, clearMessages } from '@/store';
import { assistantService } from '@/services';
import type { ChatMessageDTO } from '@/services/types';

const INITIAL_SUGGESTIONS = [
  'Check a suspicious link',
  'I think I was scammed',
  'How do I protect my family?',
  'Explain common scam types',
];

export default function AssistantScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const messages = useAppSelector((s) => s.chat.messages);
  const typing = useAppSelector((s) => s.chat.typing);
  const [input, setInput] = useState('');
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length, typing]);

  const send = async (content: string) => {
    const text = content.trim();
    if (!text) return;
    const userMsg: ChatMessageDTO = { id: `u_${Date.now()}`, role: 'user', content: text, createdAt: Date.now() };
    dispatch(addMessage(userMsg));
    setInput('');
    dispatch(setTyping(true));
    try {
      const reply = await assistantService.sendMessage(text, messages);
      dispatch(addMessage(reply));
    } finally {
      dispatch(setTyping(false));
    }
  };

  const suggestions = messages.length > 0 ? (messages[messages.length - 1].suggestions ?? INITIAL_SUGGESTIONS) : INITIAL_SUGGESTIONS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
          <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
            <ArrowLeft size={22} color={theme.colors.textPrimary} strokeWidth={2} />
          </Pressable>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.brand, alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#FFFFFF" strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.md, color: theme.colors.textPrimary }}>
              ScamShield AI
            </Text>
            <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.xs, color: theme.colors.success }}>
              Online · here to help
            </Text>
          </View>
          {messages.length > 0 && (
            <Pressable onPress={() => dispatch(clearMessages())} accessibilityLabel="Clear conversation">
              <MessageSquare size={20} color={theme.colors.textMuted} strokeWidth={2} />
            </Pressable>
          )}
        </View>

        {/* Messages */}
        <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: theme.spacing.lg, gap: theme.spacing.md }} showsVerticalScrollIndicator={false}>
          {messages.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: theme.spacing.xxl, gap: theme.spacing.lg }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.brandSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={36} color={theme.colors.brand} strokeWidth={1.8} />
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: theme.typography.fontFamilyBold, fontSize: theme.typography.sizes.lg, color: theme.colors.textPrimary }}>
                  How can I help?
                </Text>
                <Text style={{ fontFamily: theme.typography.fontFamily, fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm, lineHeight: theme.typography.lineHeight.relaxed }}>
                  Ask me about suspicious links, messages, payments, or what to do if you have been scammed.
                </Text>
              </View>
            </View>
          ) : null}

          {messages.map((msg) => (
            <View key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
              <View style={{
                backgroundColor: msg.role === 'user' ? theme.colors.brand : theme.colors.surface,
                borderRadius: theme.radii.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.md,
                borderWidth: msg.role === 'user' ? 0 : 1,
                borderColor: theme.colors.border,
              }}>
                <Text style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.md,
                  color: msg.role === 'user' ? '#FFFFFF' : theme.colors.textPrimary,
                  lineHeight: theme.typography.lineHeight.relaxed,
                }}>
                  {msg.content}
                </Text>
              </View>
              {msg.role === 'assistant' && msg.suggestions ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs, marginTop: theme.spacing.sm }}>
                  {msg.suggestions.map((s) => (
                    <Pressable key={s} onPress={() => send(s)} style={{ backgroundColor: theme.colors.brandSoft, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs, borderRadius: theme.radii.pill }}>
                      <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.xs, color: theme.colors.brand }}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ))}

          {typing ? (
            <View style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
              <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg, paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.textMuted, opacity: 0.7 - i * 0.2 }} />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        {/* Suggestions when idle */}
        {messages.length === 0 && (
          <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm, paddingBottom: theme.spacing.sm }}>
            {INITIAL_SUGGESTIONS.map((s) => (
              <Pressable key={s} onPress={() => send(s)} accessibilityLabel={s}>
                <Card padded={false} style={{ paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Sparkles size={16} color={theme.colors.brand} strokeWidth={2} />
                  <Text style={{ fontFamily: theme.typography.fontFamilyMedium, fontSize: theme.typography.sizes.sm, color: theme.colors.textPrimary, flex: 1 }}>{s}</Text>
                </Card>
              </Pressable>
            ))}
          </View>
        )}

        {/* Input bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surface }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything about scams…"
            placeholderTextColor={theme.colors.textMuted}
            accessibilityLabel="Message input"
            style={{
              flex: 1,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.sizes.md,
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.surfaceRaised,
              borderRadius: theme.radii.pill,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              maxHeight: 100,
            }}
            multiline
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim()}
            accessibilityLabel="Send message"
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: input.trim() ? theme.colors.brand : theme.colors.borderStrong,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Send size={20} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
