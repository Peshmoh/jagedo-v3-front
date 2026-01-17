import { createContext, useState, useContext, useMemo, PropsWithChildren, useCallback } from 'react';
import { CartItem } from '@/types/cart';
import { Product } from '@/hooks/useProducts';

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => { success: boolean; message: string };
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: PropsWithChildren) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = useCallback(
        (product: Product): { success: boolean; message: string } => {
            if (cartItems.length > 0) {
                const existingCartType = cartItems[0].type;
                if (product.type !== existingCartType) {
                    return {
                        success: false,
                        message: `You can only have products of type "${existingCartType}" in your cart. Please refresh the browser to clear the cart to add a different product type.`
                    };
                }
            }
            
            const productTypeUpper = product.type.toUpperCase();
            const restrictedTypes = ['FUNDI', 'PROFESSIONAL'];

            const displayType =
                productTypeUpper === 'FUNDI'
                    ? 'CUSTOM'
                    : productTypeUpper === 'PROFESSIONAL'
                        ? 'DESIGN'
                        : productTypeUpper;

            if (restrictedTypes.includes(productTypeUpper)) {
                const existingRestrictedItem = cartItems.find(
                    item => item.type.toUpperCase() === productTypeUpper
                );

                if (existingRestrictedItem && existingRestrictedItem.id !== product.id) {
                    return {
                        success: false,
                        message: `You can only have one ${displayType} product in your cart.`
                    };
                }
            }

            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item.id === product.id);

                if (existingItem) {
                    return prevItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }

                return [...prevItems, { ...product, quantity: 1 }];
            });

            return {
                success: true,
                message: `${product.name} (${displayType}) added to cart!`
            };
        },
        [cartItems]
    );

    const removeFromCart = useCallback((productId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, quantity: number) => {
        setCartItems(prevItems => {
            if (quantity <= 0) {
                return prevItems.filter(item => item.id !== productId);
            } else {
                return prevItems.map(item =>
                    item.id === productId ? { ...item, quantity } : item
                );
            }
        });
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const totalItems = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cartItems]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice
    }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};