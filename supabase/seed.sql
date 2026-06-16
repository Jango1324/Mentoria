truncate table
  public.lesson_progress,
  public.saved_opportunities,
  public.lessons,
  public.courses,
  public.opportunities
restart identity cascade;

-- Opportunities

insert into public.opportunities
(title, description, category, tags, deadline, url, is_active)
values
(
  'MIT Summer Research Program',
  'Research opportunity for high school students interested in STEM.',
  'Research',
  array['STEM','Research','MIT'],
  '2027-01-15',
  'https://mit.edu',
  true
),
(
  'International Math Olympiad Training Camp',
  'Advanced mathematics preparation and mentoring.',
  'Olympiad',
  array['Mathematics','Olympiad'],
  '2026-12-01',
  'https://imo-official.org',
  true
),
(
  'UBC Future Engineers Program',
  'Engineering exploration program for Grades 10-12.',
  'STEM',
  array['Engineering','University','Programming'],
  '2026-11-15',
  'https://ubc.ca',
  true
),
(
  'Harvard Youth Business Academy',
  'Business and entrepreneurship program.',
  'Business',
  array['Business','Entrepreneurship'],
  '2026-10-20',
  'https://harvard.edu',
  true
),
(
  'SAT Excellence Bootcamp',
  'SAT preparation and admissions mentoring.',
  'SAT',
  array['SAT','University'],
  '2026-09-15',
  'https://khanacademy.org',
  true
);

-- Courses

insert into public.courses
(title, description, category, is_published)
values
(
  'Introduction to Competitive Programming',
  'Learn problem solving, algorithms and contest strategy.',
  'Programming',
  true
),
(
  'University Applications Masterclass',
  'Applications, essays and scholarships.',
  'University',
  true
),
(
  'Research Fundamentals',
  'How to start and publish student research.',
  'Research',
  true
);

-- Lessons Course 1

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'What is Competitive Programming?',
  'https://example.com/cp-1',
  1
from public.courses c
where c.title = 'Introduction to Competitive Programming';

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Time Complexity',
  'https://example.com/cp-2',
  2
from public.courses c
where c.title = 'Introduction to Competitive Programming';

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Binary Search',
  'https://example.com/cp-3',
  3
from public.courses c
where c.title = 'Introduction to Competitive Programming';

-- Lessons Course 2

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Building a Strong Profile',
  'https://example.com/university-1',
  1
from public.courses c
where c.title = 'University Applications Masterclass';

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Writing Essays',
  'https://example.com/university-2',
  2
from public.courses c
where c.title = 'University Applications Masterclass';

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Scholarships',
  'https://example.com/university-3',
  3
from public.courses c
where c.title = 'University Applications Masterclass';

-- Lessons Course 3

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Finding a Research Topic',
  'https://example.com/research-1',
  1
from public.courses c
where c.title = 'Research Fundamentals';

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Reading Papers',
  'https://example.com/research-2',
  2
from public.courses c
where c.title = 'Research Fundamentals';

insert into public.lessons
(course_id, title, content_url, order_index)
select
  c.id,
  'Publishing Your Work',
  'https://example.com/research-3',
  3
from public.courses c
where c.title = 'Research Fundamentals';