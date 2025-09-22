import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Customer, FilterState, Interaction, CustomerStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import CustomerList from './components/CustomerList';
import CustomerFormModal from './components/CustomerFormModal';
import InteractionModal from './components/InteractionModal';
import Dashboard from './components/Dashboard';
import LoadingOverlay from './components/LoadingOverlay';

// Helper function to parse a single row of CSV, handles quoted fields.
function parseCSVRow(row: string): string[] {
    const result: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        const nextChar = row[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    result.push(currentField); // Add the last field
    return result;
}

const App: React.FC = () => {
    const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        text: '',
        status: '',
        startDate: '',
        endDate: '',
    });
    const [loadingState, setLoadingState] = useState({ active: false, message: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAddCustomerClick = () => {
        setSelectedCustomer(null);
        setIsFormModalOpen(true);
    };

    const handleEditCustomerClick = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsFormModalOpen(true);
    };

    const handleDeleteCustomer = (customerId: string) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العميل؟')) {
            setCustomers(prev => prev.filter(c => c.id !== customerId));
        }
    };

    const handleSaveCustomer = (customerData: Customer) => {
        if (selectedCustomer) {
            // Edit
            setCustomers(prev => prev.map(c => (c.id === selectedCustomer.id ? { ...customerData, id: c.id } : c)));
        } else {
            // Add
            const newCustomer = { ...customerData, id: Date.now().toString() };
            setCustomers(prev => [newCustomer, ...prev]);
        }
        setIsFormModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleViewInteractions = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsInteractionModalOpen(true);
    };
    
    const handleSaveInteractions = (customerId: string, interactions: Interaction[]) => {
        setCustomers(prev => prev.map(c => c.id === customerId ? {...c, interactions} : c));
    };
    
    const handleUpdateCustomerStatus = (customerId: string, status: CustomerStatus) => {
        setCustomers(prev => prev.map(c => c.id === customerId ? {...c, status} : c));
    };

    const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const searchText = filters.text.toLowerCase();
            const matchesText = searchText ?
                customer.name.toLowerCase().includes(searchText) ||
                customer.company.toLowerCase().includes(searchText) ||
                customer.phone.includes(searchText) ||
                customer.email.toLowerCase().includes(searchText) :
                true;

            const matchesStatus = filters.status ? customer.status === filters.status : true;
            
            const matchesDate = (() => {
                if (!filters.startDate && !filters.endDate) return true;
                if (!customer.followUpDate) return false;

                const followUpDate = new Date(customer.followUpDate);
                const startDate = filters.startDate ? new Date(filters.startDate) : null;
                const endDate = filters.endDate ? new Date(filters.endDate) : null;
                
                if(startDate) startDate.setUTCHours(0,0,0,0);
                if(endDate) endDate.setUTCHours(0,0,0,0);
                followUpDate.setUTCHours(0,0,0,0);

                if (startDate && followUpDate < startDate) return false;
                if (endDate && followUpDate > endDate) return false;
                return true;
            })();

            return matchesText && matchesStatus && matchesDate;
        }).sort((a, b) => {
            const dateA = a.followUpDate ? new Date(a.followUpDate).getTime() : Infinity;
            const dateB = b.followUpDate ? new Date(b.followUpDate).getTime() : Infinity;
            return dateA - dateB;
        });
    }, [customers, filters]);

    const exportToCSV = useCallback(() => {
        if (customers.length === 0) {
            alert('لا يوجد عملاء لتصديرهم.');
            return;
        }

        setLoadingState({ active: true, message: 'جاري تصدير البيانات...' });
        
        // Use a timeout to ensure the loading indicator is visible for fast operations
        setTimeout(() => {
            const headers = ['id', 'name', 'phone', 'email', 'company', 'address', 'city', 'linkedin', 'status', 'followUpDate', 'followUpTime', 'interactions'];
            const csvRows = ['\uFEFF' + headers.join(',')];

            const escapeCSV = (field: string | undefined | null) => {
                if (field === null || field === undefined) return '""';
                const str = String(field);
                const needsQuotes = str.includes(',') || str.includes('"') || str.includes('\n');
                if (!needsQuotes) return str;
                return `"${str.replace(/"/g, '""')}"`;
            };

            customers.forEach(customer => {
                const interactionsJSON = JSON.stringify(customer.interactions);
                const row = [
                    customer.id,
                    escapeCSV(customer.name),
                    escapeCSV(customer.phone),
                    escapeCSV(customer.email),
                    escapeCSV(customer.company),
                    escapeCSV(customer.address),
                    escapeCSV(customer.city),
                    escapeCSV(customer.linkedin),
                    customer.status,
                    customer.followUpDate || '',
                    customer.followUpTime || '',
                    escapeCSV(interactionsJSON)
                ];
                csvRows.push(row.join(','));
            });

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'customers-export.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setLoadingState({ active: false, message: '' });
        }, 500);
    }, [customers]);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setLoadingState({ active: true, message: 'جاري استيراد البيانات...' });
            
            // Use setTimeout to allow UI to render the loading state before processing
            setTimeout(() => {
                try {
                    const text = e.target?.result as string;
                    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
                    if (lines.length < 2) throw new Error('الملف فارغ أو يحتوي على رؤوس فقط.');
                    
                    const headers = parseCSVRow(lines[0].replace(/^\uFEFF/, ''));
                    const expectedHeaders = ['id', 'name', 'phone', 'email', 'company', 'address', 'city', 'linkedin', 'status', 'followUpDate', 'followUpTime', 'interactions'];
                    if (headers.length !== expectedHeaders.length || !expectedHeaders.every((h, i) => h.trim() === headers[i].trim())) {
                        throw new Error('رؤوس الأعمدة في الملف لا تتطابق مع التنسيق المطلوب.');
                    }
                    
                    const importedCustomers: Customer[] = [];
                    for (let i = 1; i < lines.length; i++) {
                        const values = parseCSVRow(lines[i]);
                        if (values.length !== headers.length) {
                            console.warn(`Skipping malformed row ${i + 1}`);
                            continue;
                        }

                        const customerData = headers.reduce((obj, header, index) => {
                            obj[header.trim()] = values[index];
                            return obj;
                        }, {} as Record<string, string>);
                        
                        if (!customerData.name || !customerData.phone) continue;
                        if (!Object.values(CustomerStatus).includes(customerData.status as CustomerStatus)) continue;
                        
                        let interactions: Interaction[] = [];
                        try {
                             interactions = JSON.parse(customerData.interactions || '[]');
                             if (!Array.isArray(interactions)) interactions = [];
                        } catch { interactions = []; }

                        importedCustomers.push({
                            id: `${Date.now()}-${i}`,
                            name: customerData.name,
                            phone: customerData.phone,
                            email: customerData.email,
                            company: customerData.company,
                            address: customerData.address || undefined,
                            city: customerData.city || undefined,
                            linkedin: customerData.linkedin,
                            status: customerData.status as CustomerStatus,
                            followUpDate: customerData.followUpDate || undefined,
                            followUpTime: customerData.followUpTime || undefined,
                            interactions,
                        });
                    }

                    if (importedCustomers.length === 0) {
                        alert('لم يتم العثور على عملاء صالحين للاستيراد في الملف.');
                        return;
                    }

                    if (window.confirm(`تم العثور على ${importedCustomers.length} عميل. هل ترغب في إضافتهم إلى قائمتك الحالية؟`)) {
                        setCustomers(prev => [...prev, ...importedCustomers]);
                        alert('تم استيراد العملاء بنجاح!');
                    }

                } catch (error) {
                    alert(`حدث خطأ أثناء استيراد الملف: ${error instanceof Error ? error.message : String(error)}`);
                    console.error(error);
                } finally {
                    if (event.target) event.target.value = '';
                    setLoadingState({ active: false, message: '' });
                }
            }, 100);
        };
        reader.readAsText(file, 'UTF-8');
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200" dir="rtl">
            {loadingState.active && <LoadingOverlay message={loadingState.message} />}
            <input type="file" ref={fileInputRef} onChange={handleFileImport} style={{ display: 'none' }} accept=".csv" />
            <Header onAddCustomer={handleAddCustomerClick} onExport={exportToCSV} onImport={handleImportClick} isLoading={loadingState.active} />
            
            <main className="container mx-auto px-4 sm:px-6 pb-8">
                <Dashboard customers={customers} />
                <CustomerList
                    customers={filteredCustomers}
                    onEdit={handleEditCustomerClick}
                    onDelete={handleDeleteCustomer}
                    onViewInteractions={handleViewInteractions}
                    onUpdateStatus={handleUpdateCustomerStatus}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
            </main>

            {isFormModalOpen && (
                <CustomerFormModal
                    customer={selectedCustomer}
                    onSave={handleSaveCustomer}
                    onClose={() => setIsFormModalOpen(false)}
                />
            )}

            {isInteractionModalOpen && selectedCustomer && (
                <InteractionModal
                    customer={selectedCustomer}
                    onClose={() => {
                        setIsInteractionModalOpen(false);
                        setSelectedCustomer(null);
                    }}
                    onSave={handleSaveInteractions}
                />
            )}
        </div>
    );
};

export default App;