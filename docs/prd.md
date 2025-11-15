🧾 Product Requirements Document (PRD)
1. Overview

Product Name: Arab Research Publishing Platform (Globally)
Goal: To provide a digital platform that enables Arabic researchers to publish their research and books globally in an organized, transparent, and accessible way.

2. Objectives

Allow researchers to submit and publish their research or books online.

Standardize the submission and review process.

Facilitate communication between researchers and administrators.

Ensure credibility and authenticity of submitted research.

3. User Roles

Researcher (Applicant):
Creates an account, submits research, uploads the file, and tracks application status.

Administrator (Admin):
Reviews submissions, updates their status, downloads files, and leaves comments or feedback.

4. Functional Requirements
A. User Registration and Login

Users can register or log in to access the system.

Fields:

Username

Email address

National ID / Residence ID

Phone number

Password (stored securely)

Features:

Email verification before account activation.

Data stored in Supabase.

Password recovery via email.

B. Research Submission Form

Allows users to submit their research for publication.

Fields:

Full Name

Country

Email

Gender

ID Number

Type of Research (Scientific Paper, Master’s Thesis, PhD Dissertation, Book)

Research Category (Health Sciences, Social Sciences, Islamic Studies, History, Economics, Engineering & IT, Others)

Main Researcher Name

General Specialization

Detailed Specialization

Upload File (PDF or DOCX)

Declaration of Accuracy (Checkbox)

Declaration Text:

I, [Researcher’s Name], hereby declare that all provided information is accurate and that this research/book is my original work. If proven otherwise, I accept full responsibility.

C. Researcher Dashboard

Sections:

Submit Research: Access the form to submit a new request.

Application Status: View submitted requests and their current status:

Pending Review

Approved

Rejected

Needs Revision

D. Admin Dashboard

Features:

View all submissions.

Open and review submission details.

Download the uploaded research file.

Update the submission status.

Add comments or feedback (visible to the researcher).

Notify researcher via email when the status changes or a comment is added.

5. Non-Functional Requirements
Category	Requirement
Security	Password encryption, file upload protection, role-based access control.
Performance	Fast load times via Netlify CDN.
Scalability	Handle thousands of users efficiently using Supabase.
Responsiveness	Mobile-friendly design (Arabic and English support in future versions).
Data Backup	Periodic backups of data and files stored in Supabase.
6. Tech Stack
Component	Technology
Frontend	HTML, CSS, JavaScript
Backend	Node.js
Database & Auth	Supabase
Hosting	Netlify
Version Control	GitHub
Email Notifications	Supabase Email / SMTP
7. Use Cases
ID	Actor	Action	Description
UC-01	Researcher	Register Account	Creates a new user profile.
UC-02	Researcher	Log In	Accesses the dashboard using credentials.
UC-03	Researcher	Submit Research	Fills out form and uploads file.
UC-04	Researcher	Track Submission	Views submission status and admin comments.
UC-05	Admin	Review Submission	Opens and reviews the uploaded research.
UC-06	Admin	Change Status	Updates request status (Approved/Rejected/etc.).
UC-07	Admin	Add Comment	Adds feedback visible to the researcher.
8. Database Schema (Proposed)

Users Table

id

username

email

national_id

phone

password_hash

created_at

Submissions Table

id

user_id (foreign key)

full_name

country

gender

email

research_type

category

main_researcher

general_specialization

detailed_specialization

file_url

status (pending, approved, rejected, needs_revision)

admin_comment

created_at

9. User Interface Layouts

Main Pages:

Home Page: Overview of the platform and its purpose.

Registration / Login Page

Researcher Dashboard: Submit and track applications.

Admin Dashboard: Manage and review submissions.

10. Development Phases (MVP Plan)
Phase	Description
Phase 1	Build core frontend pages and user authentication.
Phase 2	Implement research submission and file upload system.
Phase 3	Develop admin dashboard with status management.
Phase 4	Add email notifications and verification.
Phase 5	UI/UX improvements and beta release.