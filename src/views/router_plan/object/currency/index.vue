<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="通用要求" type="success">
      <router-view />
    </el-alert>
  </div>
</template>
