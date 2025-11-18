# -*- coding: utf-8 -*-

# Read the file
with open('public/pages/researcher/profile.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find and fix the missing closing div
for i in range(len(lines)):
    if '<!-- Contact Support Section -->' in lines[i] and '</div>' not in lines[i-1]:
        # Check if we need to add closing div for info-grid
        if '</div>' not in lines[i-1] and 'info-grid' in ''.join(lines[max(0, i-10):i]):
            lines.insert(i, '                    </div>\n')
            break

# Write the file
with open('public/pages/researcher/profile.html', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("File fixed successfully!")


