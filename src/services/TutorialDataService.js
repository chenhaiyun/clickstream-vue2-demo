import {Service} from "../http-common";
// import {Service} from './Service'
// export function getAll() {
//   return Service({
//     url: '/product/all',
//     method: 'get'
//   })
// }
// export function getById(productId) {
//   return Service({
//     url: '/product/getById',
//     params: { productId: productId },
//     method: 'get'
//   })
// }

class TutorialDataService {
  getAll() {
     return Service({
    url: '/product/all',
    method: 'get'
  })
  }

  // get(id) {
  //   return http.get(`/tutorials/${id}`);
  // }

  // create(data) {
  //   return http.post("/tutorials", data);
  // }

  // update(id, data) {
  //   return http.put(`/tutorials/${id}`, data);
  // }

  // delete(id) {
  //   return http.delete(`/tutorials/${id}`);
  // }

  // deleteAll() {
  //   return http.delete(`/tutorials`);
  // }

  // findByTitle(title) {
  //   return http.get(`/tutorials?title=${title}`);
  // }
}

export default new TutorialDataService();
