# TODO

- in chat-message.tsx move DATE_FORMATTER to a separete file, maybe utils/date.ts
- change React.FormEvent<HTMLFormElement> it's deprecated, You probably meant to use ChangeEvent, InputEvent, SubmitEvent, or just SyntheticEvent instead depending on the event type.
  - in chat-input.tsx and maybe other files
- in [id]/page.tsx add not-found.tsx page instead of default 404 page for the notFound() function
- maybe cache getCurrentUser()
- add LoadingSwap component we use swap in: invite-user-modal.tsx, and other places
