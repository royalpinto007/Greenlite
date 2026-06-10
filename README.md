# Greenlite

The mobile command + approval cockpit for your AI agents. Android + iOS, one
Expo / React Native codebase.

Every other tool in the suite (Resolvd, Webhands, Pacewatch-style agents) takes
real actions, but the risky ones need a human to greenlight them, and you're
rarely at a desk. Greenlite is that human-in-the-loop layer in your pocket: an
agent wants to act -> your phone buzzes -> you see the full context and the
proposed action -> approve or deny in one tap.

## What it does

- **Approvals feed**, pulls pending escalations across your agents (today,
  Resolvd's escalated tickets) with the proposed action and why it escalated.
- **Review + decide**, tap any item to see the full message and one-tap
  Approve / Deny, which routes back to the originating agent's approve endpoint.
- **Push notifications**, `expo-notifications` registration so an agent can
  buzz the phone the moment it needs a decision.
- **Demo mode**, runs with sample approvals when no backend is configured, so
  the app is explorable immediately.

## Stack

Expo (SDK 51) + expo-router + TypeScript, `@supabase/supabase-js` for reads,
`expo-notifications` for push. Builds to native Android + iOS.

## Run

```bash
npm install
# set credentials in app.json -> expo.extra (or EAS secrets):
#   supabaseUrl, supabaseAnonKey, resolvdUrl, resolvdToken
npx expo start          # scan the QR with Expo Go, or run on a simulator
```

Build native binaries with EAS:

```bash
npx eas build -p android
npx eas build -p ios
```

## How it ties the suite together

Greenlite is the control surface that makes autonomy safe to turn on. The agents
act on the safe cases automatically and push the rest here; you stay in control
without sitting at a dashboard. The approval contract (an item with a
`proposedAction` + a back-end `/api/approve`) is generic, so any new agent that
escalates plugs straight into the same feed.
