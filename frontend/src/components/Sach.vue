<template>
  <div>
    <h2>Danh Sách Sách (Component)</h2>
    <ul v-if="sachList.length">
      <li v-for="sach in sachList" :key="sach._id">{{ sach.TenSach }} - {{ sach.NguonGoc }}</li>
    </ul>
    <p v-else>Không có dữ liệu</p>
  </div>
</template>

<script>
export default {
  props: {
    sachList: {
      type: Array,
      required: true
    }
  }
};
</script>
