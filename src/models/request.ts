export interface RegisterUser {
    email: string;
    password: string;
    firstname: string;
    // surname: string;
    sex: string;
    // province: string;
    phone_number: string;
    type?: number;
}

export interface RegisterOwner {
    email: string;
    password: string;
    shop_name: string;
    firstname: string;
    surname: string;
    sub_district: string;
    district: string;
    province: string;
    postal_code: string;
    address: string;
    phone_number: string;
    shop_type: number;
    latitude: string;
    longitude: string;
    type: number; 
}

export interface UpdateOwner {
    email: string;
    shop_name: string;
    firstname?: string;
    surname?: string;
    sub_district?: string;
    district?: string;
    province?: string;
    postal_code?: string;
    address?: string;
    phone_number?: string;
    shop_type: number;
    latitude: string;
    longitude: string; 
}

export interface Login {
    email: string;
    password: string;
}

export interface UpdateUser {
    email?: string;
    firstname?: string;
    surname?: string;
    profile_picture?: any;
    sex?: string;
    phone_number?: string;
    user_id : number
}

export interface ShopRecommended {
    shop_id: number ;
    recommended: string ;
}

export interface ShopPromotion {
    promotion: string;
    description?: string;
    promotion_id: number;
    shop_id: number
}