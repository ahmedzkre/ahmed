// ننتظر تحميل DOM بالكامل قبل تنفيذ الكود
document.addEventListener('DOMContentLoaded', function() {
    // تحميل بيانات المستخدمين من localStorage أو إنشاء مصفوفة فارغة إذا لم توجد بيانات
    let users = JSON.parse(localStorage.getItem('site-users')) || [];
    let editingUserId = null; // لتخزين معرف المستخدم الذي يتم تعديله

    // دالة لحفظ المستخدمين في localStorage وعرضهم
    function saveUsers() {
        try {
            localStorage.setItem('site-users', JSON.stringify(users));
            displayUsers(); // عرض البيانات المحدثة مباشرة بعد الحفظ
        } catch (error) {
            console.error('حدث خطأ أثناء حفظ البيانات:', error);
            alert('حدث خطأ أثناء حفظ البيانات');
        }
    }

    // دالة لعرض المستخدمين في الجدول
    function displayUsers() {
        const usersList = document.getElementById('users-list');
        if (!usersList) return; // التحقق من وجود العنصر
        
        usersList.innerHTML = ''; // تفريغ الجدول أولاً

        // إذا لم يكن هناك مستخدمين، نعرض رسالة
        if (users.length === 0) {
            usersList.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">لا يوجد مستخدمين مسجلين</td>
                </tr>
            `;
            return;
        }

        // إضافة كل مستخدم إلى الجدول
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(user.name)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.phone)}</td>
                <td><span class="role-${user.role}">${user.role === 'admin' ? 'مدير' : 'مستخدم'}</span></td>
                <td>
                    <button class="action-btn edit-btn" data-id="${user.id}">تعديل</button>
                    <button class="action-btn delete-btn" data-id="${user.id}">حذف</button>
                </td>
            `;
            usersList.appendChild(row);
        });

        // إعادة ربط أحداث الأزرار بعد تحديث الجدول
        bindTableEvents();
    }

    // دالة لربط أحداث الأزرار في الجدول
    function bindTableEvents() {
        // أحداث أزرار التعديل
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                editUser(userId);
            });
        });
        
        // أحداث أزرار الحذف
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                deleteUser(userId);
            });
        });
    }

    // دالة لتعديل مستخدم
    function editUser(userId) {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        editingUserId = userId; // حفظ معرف المستخدم الذي يتم تعديله
        
        // ملء النموذج ببيانات المستخدم
        document.getElementById('form-title').textContent = 'تعديل المستخدم';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-phone').value = user.phone;
        document.getElementById('user-password').value = user.password;
        document.getElementById('user-role').value = user.role;
    }

    // دالة لحذف مستخدم
    function deleteUser(userId) {
        if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
        
        users = users.filter(u => u.id !== userId); // تصفية المصفوفة
        saveUsers(); // حفظ التغييرات
        
        // إذا كان المستخدم المحذوف هو الذي يتم تعديله، نعيد تعيين النموذج
        if (editingUserId === userId) {
            resetUserForm();
        }
    }

    // دالة لحفظ/تحديث المستخدم
    function saveUser() {
        // جمع البيانات من النموذج
        const id = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();
        const password = document.getElementById('user-password').value;
        const role = document.getElementById('user-role').value;
        
        // التحقق من صحة البيانات المدخلة
        if (!validateInput(name, email, phone, password)) return;

        // إعداد كائن بيانات المستخدم
        const userData = {
            id: id ? parseInt(id) : generateNewId(),
            name,
            email,
            phone,
            password,
            role
        };

        if (editingUserId) {
            // حالة التعديل: تحديث بيانات المستخدم الموجود
            const index = users.findIndex(u => u.id === editingUserId);
            if (index !== -1) {
                users[index] = userData;
                alert('تم تحديث بيانات المستخدم بنجاح');
            }
        } else {
            // حالة الإضافة: التحقق من عدم تكرار البريد الإلكتروني
            if (users.some(u => u.email === email)) {
                alert('هذا البريد الإلكتروني مسجل بالفعل');
                return;
            }
            users.push(userData);
            alert('تم إضافة المستخدم بنجاح');
        }
        
        saveUsers(); // حفظ التغييرات
        resetUserForm(); // إعادة تعيين النموذج
    }

    // دالة لإنشاء معرف جديد
    function generateNewId() {
        return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    }

    // دالة للتحقق من صحة البيانات المدخلة
    function validateInput(name, email, phone, password) {
        if (!name || !email || !phone || !password) {
            alert('الرجاء ملء جميع الحقول المطلوبة');
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('الرجاء إدخال بريد إلكتروني صحيح');
            return false;
        }

        return true;
    }

    // دالة لإعادة تعيين النموذج
    function resetUserForm() {
        editingUserId = null;
        document.getElementById('form-title').textContent = 'إضافة مستخدم جديد';
        document.getElementById('user-id').value = '';
        document.getElementById('user-name').value = '';
        document.getElementById('user-email').value = '';
        document.getElementById('user-phone').value = '';
        document.getElementById('user-password').value = '';
        document.getElementById('user-role').value = 'user';
    }

    // دالة للتحقق من صحة البريد الإلكتروني
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // دالة لمنع هجمات XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // إضافة مستخدم افتراضي إذا لم يكن هناك مستخدمين
    if (users.length === 0) {
        users.push({
            id: 1,
            name: 'مدير النظام',
            email: 'admin@example.com',
            phone: '0912345678',
            password: 'admin123',
            role: 'admin'
        });
        saveUsers();
    } else {
        displayUsers();
    }

    // ربط حدث حفظ المستخدم
    const saveBtn = document.getElementById('save-user');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveUser);
    }

    // ربط حدث إلغاء التعديل
    const cancelBtn = document.getElementById('cancel-edit');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetUserForm);
    }
});



// فلترة فروعنا
document.addEventListener('DOMContentLoaded', function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const branchCards = document.querySelectorAll('.branch-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // إزالة النشط من جميع الأزرار
      filterBtns.forEach(button => button.classList.remove('active'));
      // إضافة النشط للزر المختار
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      branchCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          if (card.getAttribute('data-region') === filterValue) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
            }, 100);
          } else {
            card.style.opacity = '0';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }
      });
    });
  });
});