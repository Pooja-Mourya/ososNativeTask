import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  decrement,
  increment,
  removeFromCart,
} from '../product/ProductSlice';

const ProductDetailModal = ({productDetail, setProductDetail}) => {
  const dispatch = useDispatch();
  const isInCart = useSelector(state =>
    state.product.cart.some(cartItem => cartItem.id === productDetail.id),
  );

  const quantity = useSelector(
    state =>
      state.product.cart.find(cartItem => cartItem.id === productDetail.id)
        ?.quantity || 1,
  );

  const handleAddToCart = () => {
    dispatch(addToCart(productDetail));
    // setProductDetail(null);
  };

  const handleIncrement = () => {
    dispatch(increment(productDetail.id));
  };

  const handleDecrement = () => {
    dispatch(decrement(productDetail.id));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(productDetail.id));
    // setProductDetail(null);
  };

  return (
    <Modal
      visible={!!productDetail}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setProductDetail(null)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={{uri: productDetail.image}} style={styles.image} />
          <Text style={styles.title}>{productDetail.title}</Text>
          <Text style={styles.description}>{productDetail.description}</Text>
          <Text style={styles.price}>Rs {productDetail.price}</Text>
          <Text style={styles.rating}>
            Rating: {productDetail.rating.rate} ({productDetail.rating.count}
            reviews)
          </Text>
          {isInCart && (
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.countButton}
                onPress={handleIncrement}>
                <Text style={styles.counterButton}>+</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.countButton}
                onPress={handleDecrement}>
                <Text style={styles.counterButton}>-</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={[
                styles.addToCartButton,
                {backgroundColor: isInCart ? 'green' : '#ff5722'},
              ]}
              onPress={isInCart ? handleRemoveFromCart : handleAddToCart}>
              <Text style={styles.addToCartText}>
                {isInCart ? 'Remove' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
            <View style={{width: 10}}></View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setProductDetail(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 5,
    width: '40%',
  },
  addToCartText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    width: '40%',
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  countButton: {
    width: 30,
    height: 30,
    backgroundColor: '#888',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  counterButton: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
});

export default ProductDetailModal;
