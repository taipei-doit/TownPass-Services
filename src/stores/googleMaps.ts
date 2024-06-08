import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { Loader } from '@googlemaps/js-api-loader';

export const useGoogleMapsStore = defineStore('googleMaps', () => {
  const loader = new Loader({
    // 替換成您的 API KEY
    apiKey: '',
    version: 'weekly',
    libraries: ['places', 'geometry']
  });

  /**
   * 是否顯示未開啟取用位置權限通知
   */
  const showMapNotification = ref(false);

  /**
   * 獲取目前位置
   */
  const gettingPosition = () => {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        const option = {
          enableAcuracy: false, // 提高精確度
          maximumAge: 0, // 設定上一次位置資訊的有效期限(毫秒)
          timeout: 10000 // 逾時計時器(毫秒)
        };
        navigator.geolocation.getCurrentPosition(resolve, reject, option);
      });
    } else {
      alert('Does not support positioning!');
    }
  };

  /**
   * 獲取完整地址
   * @param geocoder
   * @param location
   * @param handleGeocodeFilteredResponse
   */
  const getFullAddress = (
    geocoder: any,
    location: any,
    handleGeocodeFilteredResponse: Function
  ) => {
    geocoder.geocode({ location }, (results: any, status: any) => {
      handleGeocodeResponse(results, status, handleGeocodeFilteredResponse);
    });
  };

  /**
   * 定義一個函數用於處理地理編碼的響應
   * @param results
   * @param status
   */
  const handleGeocodeResponse = (
    results: any,
    status: any,
    handleGeocodeFilteredResponse: Function
  ) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log('Geocoder found: ', results);

      const addressArray = results.filter(
        (item: any) =>
          item.formatted_address.includes('號') || item.formatted_address.includes('No.')
      );

      if (results[0]) {
        console.log('Full Address: ' + results[0].formatted_address);
        handleGeocodeFilteredResponse(addressArray);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  };

  const displayAddress = (array: any[]) => {
    const filterArray = array.filter(
      (item: any) =>
        item.address_components.filter(
          (item: any) =>
            item.types.includes('route') ||
            item.types.includes('premise') ||
            item.types.includes('street_address') ||
            item.types.includes('street_number')
        ).length > 0
    );
    // || item.types.includes('point_of_interest')
    if (filterArray.length == 0) {
      return;
    }

    const firstResult = filterArray[0];
    console.log('firstResult', firstResult);
    const address_components = firstResult.address_components;
    const prefixAddress: any[] = []; // 市,區; 縣,市,鄉,鎮
    const suffixAddress: any[] = []; // 路,段,號
    let city = '';
    let district = '';
    let road = '';
    let section = '';
    let lane = '';
    let alley = '';
    let no = '';
    address_components.forEach((element: any) => {
      if (element.types.includes('street_number')) {
        const componentNo = element.long_name.includes('號')
          ? `${element.long_name}`
          : `${element.long_name}號`;
        suffixAddress.push(componentNo);
        no = componentNo;
      } else if (element.types.includes('route')) {
        suffixAddress.push(`${element.long_name}`);

        // 使用正則表達式來切分
        const parts = element.long_name.match(/(.*?路|.*?街|.*?大道|.*?段|.*?巷|.*?弄)/g) || [
          element.long_name
        ];
        // console.log('parts', parts);
        parts.forEach((part: string) => {
          if (part.includes('路') || part.includes('街') || part.includes('大道')) {
            road = part;
          } else if (part.includes('段')) {
            section = part;
          } else if (part.includes('巷')) {
            lane = part;
          } else if (part.includes('弄')) {
            alley = part;
          } else {
            road = part;
          }
        });
      } else if (element.types.includes('administrative_area_level_4')) {
        // prefixAddress.push(`${element.long_name}`)
      } else if (element.types.includes('administrative_area_level_3')) {
        // 里
        prefixAddress.push(`${element.long_name}`);
      } else if (element.types.includes('administrative_area_level_2')) {
        // 區
        prefixAddress.push(`${element.long_name}`);
        district = element.long_name;
      } else if (element.types.includes('administrative_area_level_1')) {
        // 縣市
        prefixAddress.push(`${element.long_name}`);
        city = element.long_name;
      }
    });
    prefixAddress.reverse();
    suffixAddress.reverse();
    return {
      title: suffixAddress.join(''),
      subtitle: prefixAddress.join(''),
      address: `${prefixAddress.join('')}${suffixAddress.join('')}`,
      location: array[0].geometry.location,
      splitAddress: {
        city,
        district,
        road,
        section,
        lane,
        alley,
        no
      }
    };
  };

  return {
    loader,
    showMapNotification,
    gettingPosition,
    getFullAddress,
    handleGeocodeResponse,
    displayAddress
  };
});
