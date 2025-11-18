# -*- coding: utf-8 -*-
import re

# Read the file
with open('public/pages/researcher/profile.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the complete contact section with all information
contact_section = '''                    <!-- Contact Support Section -->
                    <div class="info-card" style="margin-top: var(--spacing-lg);">
                        <h3>
                            <i class="fas fa-headset"></i>
                            التواصل مع الدعم
                        </h3>
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                            <a href="https://wa.me/966580002284" target="_blank" class="btn" style="background: #25D366; color: white; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: var(--spacing-md); border-radius: var(--radius-md); transition: all 0.3s ease;">
                                <i class="fab fa-whatsapp"></i>
                                التواصل عبر واتساب
                            </a>
                            <a href="tel:+966580002284" class="btn" style="background: var(--primary-color); color: white; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: var(--spacing-md); border-radius: var(--radius-md); transition: all 0.3s ease;">
                                <i class="fas fa-phone"></i>
                                الاتصال: 966580002284
                            </a>
                            <a href="mailto:rafrs2030@gmail.com" class="btn" style="background: var(--primary-light); color: white; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: var(--spacing-sm); padding: var(--spacing-md); border-radius: var(--radius-md); transition: all 0.3s ease;">
                                <i class="fas fa-envelope"></i>
                                البريد الإلكتروني: rafrs2030@gmail.com
                            </a>
                        </div>
                    </div>'''

# Replace the existing contact section if it exists, or add it if it doesn't
if '<!-- Contact Support Section -->' in content:
    # Replace existing contact section
    content = re.sub(
        r'<!-- Contact Support Section -->.*?</div>\s*</div>',
        contact_section,
        content,
        flags=re.DOTALL
    )
else:
    # Add contact section before closing the personal-info tab
    content = re.sub(
        r'(                    </div>\s*</div>\s*<!-- Account Settings Tab -->)',
        contact_section + r'\n                </div>\n\n                <!-- Account Settings Tab -->',
        content
    )

# Write the file
with open('public/pages/researcher/profile.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("تم إكمال قسم التواصل بنجاح!")
print("- رابط واتساب: https://wa.me/966580002284")
print("- رقم الجوال: 966580002284")
print("- البريد الإلكتروني: rafrs2030@gmail.com")


