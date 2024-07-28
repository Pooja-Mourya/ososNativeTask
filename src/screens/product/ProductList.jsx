import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchProducts,
  addToCart,
  selectIsInCart,
  removeFromCart,
} from './ProductSlice';
import ProductDetailModal from '../modal/ProductDetailModal';
import {AirbnbRating} from 'react-native-ratings';

export default function ProductList() {
  const dispatch = useDispatch();
  const {products, status, error, totalCartItems} = useSelector(
    state => state.product,
  );
  const cartItems = useSelector(state => state.product.cart);

  const [productDetail, setProductDetail] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = cartItem => {
    dispatch(addToCart(cartItem));
  };

 

  const renderItem = ({item}) => {
    const isInCart = selectIsInCart({product: {cart: cartItems}}, item.id);

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setProductDetail(item);
        }}>
        <Image source={{uri: item.image}} style={styles.image} />
        <View style={styles.itemDetails}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={{flex:1, justifyContent:'space-between', flexDirection:'row'}}>
            <AirbnbRating
              count={7}
              reviews={[
                'Terrible',
                'Bad',
                'OK',
                'Good',
                'Very Good',
                'Wow',
                'Amazing',
              ]}
              defaultRating={item.rating.rate}
              size={18}
              showRating={false}
              starContainerStyle={styles.ratingContainer}
            />
            <Text>{item.rating.count} </Text>
          </View>
          <Text style={styles.price}>Rs {item.price}</Text>

          <View>
            <Text>Category : {item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (status === 'loading') {
    return (
      <ActivityIndicator
        size="large"
        color="teal"
        style={styles.loadingIndicator}
      />
    );
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <>
      <Text style={styles.shoppingText}>Shopping</Text>
      <View style={styles.container}>
        <Text style={styles.cartSummary}>
          Total Items in Cart: {totalCartItems}
        </Text>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      {productDetail && (
        <ProductDetailModal
          setProductDetail={setProductDetail}
          productDetail={productDetail}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    height: 70,
  },
  price: {
    fontSize: 14,
    color: '#000',
    fontWeight:'600'
  },
  cartSummary: {
    color: 'teal',
    fontWeight: '600',
    fontSize: 23,
    paddingHorizontal: 20,
  },
  ratingText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  ratingContainer: {
    width: '40%',
    paddingLeft: 20,
  },
  image: {
    width: 120,
    height: '100%',
    resizeMode: 'contain',
  },
  addToCartButton: {
    padding: 10,
    borderRadius: 5,
    marginTop: 40,
    width: '100%',
    marginHorizontal: 0,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingIndicator: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  shoppingText: {
    textAlign: 'center',
    fontWeight: '600',
    padding: 10,
    backgroundColor: 'teal',
    fontSize: 25,
    color: '#fff',
  },
});
