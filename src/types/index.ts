// System Types
export type SystemType = {
    id: string;
    name: string;
    description: string | null;
    default_terms: string[] | null;
    created_at: string;
};

// Products (solar system packages)
export type Product = {
    id: string;
    system_type_id: string | null;
    name: string;
    brand: string | null;
    capacity_kw: number | null;
    phase: number;
    base_price: number;
    gst_rate: number;
    is_active: boolean;
    created_at: string;
};

// Components (BOM items)
export type Component = {
    id: string;
    system_type_id: string | null;
    name: string;
    description: string | null;
    default_quantity: string;
    default_make: string;
    sort_order: number;
    is_default: boolean;
    created_at: string;
};

// Quotation
export type Quotation = {
    id: string;
    quote_number: string | null;
    customer_name: string;
    customer_phone: string | null;
    customer_address: string | null;
    customer_email: string | null;
    quote_date: string;
    system_type_id: string | null;
    system_type?: SystemType;
    capacity_kw: number | null;
    phase: number;
    brand: string | null;
    base_price: number | null;
    gst_rate: number;
    gst_amount: number | null;
    total_amount: number | null;
    central_subsidy: number;
    state_subsidy: number;
    terms: string[] | null;
    components: QuotationComponent[] | null;
    savings_data: SavingsData | null;
    salesperson: string | null;
    status: string;
    pdf_url: string | null;
    pdf_storage_path?: string | null;
    tenant_id?: string | null;
    vendor_id?: string | null;
    node_id?: string | null;
    created_at: string;
};

// Quotation Component (items in a quote)
export type QuotationComponent = {
    id?: string;
    name: string;
    description: string;
    quantity: string;
    make: string;
    sort_order: number;
};

// Savings Calculator Data
export type SavingsData = {
    capacity_kw: number;
    units_per_day: number;
    annual_units: number;
    cost_per_unit: number;
    annual_savings: number;
    central_subsidy: number;
    state_subsidy: number;
    total_subsidy: number;
    net_cost: number;
    roi_years: number;
};

// Form types for creating/editing
export type ProductFormData = {
    system_type_id: string;
    name: string;
    brand: string;
    capacity_kw: number;
    phase: number;
    base_price: number;
    gst_rate: number;
};

export type ComponentFormData = {
    system_type_id: string;
    name: string;
    description: string;
    default_quantity: string;
    default_make: string;
    sort_order: number;
    is_default: boolean;
};

export type QuotationFormData = {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    customer_email: string;
    system_type_id: string;
    capacity_kw: number;
    phase: number;
    brand: string;
    base_price: number;
    gst_rate: number;
    central_subsidy: number;
    state_subsidy: number;
    terms: string[];
    components: QuotationComponent[];
    salesperson: string;
};

// Vendor (Tenant Profile)
export type Vendor = {
    id: string;
    name: string;
    slug?: string | null;
    node_id?: string | null;
    quote_prefix?: string | null;
    qr_code_url?: string | null;
    plan_tier?: string | null;
    is_demo?: boolean;
    tagline?: string | null;
    gstin?: string | null;
    phone?: string | null;
    alternate_phone?: string | null;
    email?: string | null;
    head_office?: string | null;
    registered_office?: string | null;
    bank_name?: string | null;
    bank_branch?: string | null;
    account_name?: string | null;
    account_number?: string | null;
    ifsc?: string | null;
    upi_id?: string | null;
    logo_url?: string | null;
    signature_url?: string | null;
    stamp_url?: string | null;
    authorized_signatory?: string | null;
    default_margin?: number;
    components_settings?: any;
    status: 'active' | 'suspended';
    vendor_users?: VendorUser[];
    created_at?: string;
    updated_at?: string;
};

// Vendor User
export type VendorUser = {
    id: string;
    vendor_id: string;
    role: 'super_admin' | 'vendor' | 'salesperson';
    full_name?: string | null;
    email?: string | null;
    vendor?: Vendor;
};

