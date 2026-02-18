# Setup Module UI Redesign Plan

## Objective
Apply the same UI design pattern from the Charges module to all other Setup modules.

## Design Pattern (from Charges Module)

### 1. **Form Input Fields**
```jsx
// Before
className="w-full mt-1 border rounded px-3 py-2"

// After
className="w-full mt-1 border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2"
```

### 2. **Required Field Labels**
```jsx
// Before
<label className="text-sm font-medium">Field Name *</label>

// After
<label className="text-sm font-medium">Field Name <span className="text-red-500">*</span></label>
```

### 3. **Modal/Form Footer**
```jsx
// Before
className="flex justify-end px-4 py-3 border-t"
className="flex justify-end p-3 border-t"
className="flex justify-end p-4 border-t"

// After
className="flex justify-end px-4 py-3 border-t border-gray-300 bg-gray-50"
className="flex justify-end p-3 border-t border-gray-300 bg-gray-50"
className="flex justify-end p-4 border-t border-gray-300 bg-gray-50"
```

### 4. **Table Rows**
```jsx
// Before
className="hover:bg-gray-50 group"
className="hover:bg-gray-100 group"

// After
className="hover:bg-gray-50 group border border-gray-200"
```

### 5. **Action Buttons (Edit/Delete)**
```jsx
// Edit Button - Before
className="text-purple-500 hover:text-purple-600"
className="text-purple-600 hover:text-purple-800"

// Edit Button - After
className="text-purple-600 hover:text-purple-800 hover:bg-purple-200 p-1 rounded"

// Delete Button - Before
className="text-red-500 hover:text-red-600"
className="text-red-600 hover:text-red-800"

// Delete Button - After
className="text-red-600 hover:text-red-800 hover:bg-red-200 p-1 rounded"
```

### 6. **Sidebar Navigation (Active State)**
```jsx
// Before
isActive ? "bg-purple-200 text-purple-600 font-bold" : "hover:bg-purple-100 hover:text-purple-500"

// After
isActive ? "bg-[#6046B5] text-white font-bold" : "hover:bg-[#6046B5] hover:text-white"
```

### 7. **Select Dropdowns**
```jsx
// Before
className="border p-2 rounded"
className="w-full mt-1 border rounded px-3 py-2"

// After
className="border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2"
```

### 8. **Textarea**
```jsx
// Before
className="border p-2 rounded"
className="w-full mt-1 border rounded px-3 py-2"

// After
className="border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2"
```

---

## Files to Update

### Pages (51 files)
1. **Appointment** (2 files)
   - AppointmentPriority.jsx
   - Shift.jsx

2. **Bed** (5 files)
   - BedGroupList.jsx
   - BedList.jsx
   - BedStatus.jsx
   - BedTypeList.jsx
   - FloorList.jsx

3. **Finance** (2 files)
   - ExpenseHead.jsx
   - IncomeHead.jsx

4. **Finding** (2 files)
   - FindingCategory.jsx
   - FindingSetup.jsx

5. **Front_Office** (3 files)
   - ComplaintType.jsx
   - PurposeList.jsx
   - Source.jsx

6. **Header_Footer** (15 files)
   - All header/footer templates

7. **Inventory** (3 files)
   - ItemCategory.jsx
   - ItemStore.jsx
   - ItemSupplier.jsx

8. **Operation** (1 file)
   - OperationList.jsx

9. **Pathology** (2 files)
   - PathologyCategory.jsx
   - PathologyParameter.jsx

10. **Pharmacy** (7 files)
    - Company.jsx
    - Dose.jsx
    - MedicineCategory.jsx
    - MedicineDosage.jsx
    - MedicineGroup.jsx
    - Supplier.jsx
    - Unit.jsx

11. **Radiology** (2 files)
    - RadiologyCategory.jsx
    - RadiologyParameter.jsx

12. **Symptoms** (1 file)
    - Symptoms.jsx

13. **Vital** (1 file)
    - Vital.jsx

### Components (30 files)
1. **Appointment** - SlotsSidebarMenu.jsx
2. **Bed** (6 files) - Add/Update components
3. **Finance** - FinanceSidebarMenu.jsx
4. **Finding** - FindingSidebarMenu.jsx
5. **Front_Office** - PurposeSidebarMenu.jsx
6. **Header_Footer** (2 files)
7. **Inventory** - ItemSidebarMenu.jsx
8. **Operation** - OperationSidebarMenu.jsx
9. **Pathology** - PathologySidebarMenu.jsx
10. **Pharmacy** - MedicineSidebarMenu.jsx
11. **Radiology** - RadiologySidebarMenu.jsx
12. **Symptoms** - SymptomsSidebarMenu.jsx
13. **Vital** - VitalSidebarMenu.jsx

---

## Update Strategy

### Priority 1: High-Traffic Modules
1. Pharmacy (7 pages + sidebar)
2. Bed (5 pages + 6 components)
3. Pathology (2 pages + sidebar)
4. Radiology (2 pages + sidebar)

### Priority 2: Medium-Traffic Modules
1. Inventory (3 pages + sidebar)
2. Front_Office (3 pages + sidebar)
3. Finance (2 pages + sidebar)
4. Finding (2 pages + sidebar)
5. Appointment (2 pages + sidebar)

### Priority 3: Lower-Traffic Modules
1. Header_Footer (15 pages + 2 components)
2. Operation (1 page + sidebar)
3. Symptoms (1 page + sidebar)
4. Vital (1 page + sidebar)

---

## Implementation Notes

### What to Update:
✅ Input field styling
✅ Select dropdown styling
✅ Textarea styling
✅ Required field indicators (red asterisk)
✅ Modal/form footer styling
✅ Table row hover effects
✅ Edit/Delete button hover effects
✅ Sidebar active state colors

### What NOT to Change:
❌ Component logic
❌ State management
❌ API calls
❌ Event handlers
❌ Data flow
❌ Functionality

---

## Testing Checklist (Per Module)

After updating each module:
- [ ] Forms render correctly
- [ ] Input focus states work (purple border)
- [ ] Required field asterisks are red
- [ ] Modal footers have gray background
- [ ] Table rows have hover effects
- [ ] Edit buttons have purple hover background
- [ ] Delete buttons have red hover background
- [ ] Sidebar active state is purple background with white text
- [ ] No console errors
- [ ] All functionality still works

---

## Estimated Time
- **Per simple page** (1 form, 1 table): ~5 minutes
- **Per complex page** (multiple forms/tables): ~10 minutes
- **Per sidebar component**: ~3 minutes
- **Total estimated time**: ~6-8 hours

---

## Status Tracking

### Completed Modules:
✅ Charges (5 pages + 12 components) - DONE

### In Progress:
🔄 [Module name]

### Pending:
⏳ All other modules
