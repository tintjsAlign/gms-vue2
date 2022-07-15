<template>
  <div>
    <div style="margin-bottom: 15px">Your roles: {{ roles }}</div>
    Switch roles:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="router_ready" />
      <el-radio-button label="router_plan" />
      <el-radio-button label="router_scene" />
      <el-radio-button label="router_result" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['roles']),
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
}
</script>
