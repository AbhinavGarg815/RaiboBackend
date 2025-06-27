 const DB_NAME = 'raibo'

const jobType = [
    //User
    'verify-user-email',
    'user-welcome',
    'order-placed',
    'out-for-delivery',
    'delivered',
    //Sellers
    'verify-company-email',
    'kyc-start',
    'kyc-complete',
    'product-added',
    'product-modified',
    'product-purchased-by-user',
    'product-pickedup',
    'product-delivered',
    'customer-review',
    'product-dispute'
];

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

export { DB_NAME, jobType, NAMESPACE };
