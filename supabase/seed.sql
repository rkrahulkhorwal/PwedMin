-- Seed data for demo purposes
-- This will insert default checklist items for new users

INSERT INTO public.checklist_items (user_id, task, completed, category, priority)
SELECT
  auth.uid(),
  task,
  false,
  category,
  priority
FROM (VALUES
  ('Book ceremony venue', 'venue', 'high'),
  ('Book reception venue', 'venue', 'high'),
  ('Hire wedding planner', 'planning', 'medium'),
  ('Create guest list', 'guests', 'high'),
  ('Send save-the-dates', 'guests', 'medium'),
  ('Book photographer', 'vendors', 'high'),
  ('Book videographer', 'vendors', 'medium'),
  ('Book caterer', 'vendors', 'high'),
  ('Choose wedding cake', 'food', 'medium'),
  ('Book florist', 'decor', 'medium'),
  ('Book DJ or band', 'vendors', 'medium'),
  ('Choose invitations', 'planning', 'medium'),
  ('Register for gifts', 'planning', 'low'),
  ('Plan honeymoon', 'planning', 'low')
) AS t(task, category, priority)
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid());
