<template>
  <div>
    <ToastInfo :toast="toastCtl" />
    <v-container class="pa-md-12">
      <v-card flat class="mx-auto" max-width="700" rounded="lg">
        <v-card-title>
          数据源
          <span class="ml-auto pl-4">
            <v-btn
              icon
              size="small"
              class="bg-secondary"
              @click="$router.go(-1)"
              ><v-icon>mdi-arrow-left</v-icon></v-btn
            >
          </span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-sheet max-width="800" class="mx-auto pa-4">
            <v-form ref="form" v-model="valid" fast-fail @submit.prevent>
              <v-text-field
                :rules="[rules.required, rules.checkNo]"
                v-model="data.no"
                label="编号"
                required
                spellcheck="false"
              ></v-text-field>
              <v-text-field
                :rules="[rules.required]"
                v-model="data.name"
                label="名称"
                required
                focused
                spellcheck="false"
              ></v-text-field>
              <v-text-field
                :rules="[rules.required, rules.validJdbcUrl]"
                v-model="data.url"
                label="JDBC 地址"
                required
                spellcheck="false"
                :append-inner-icon="connFlag"
              ></v-text-field>
              <v-btn button @click="testConn">测试</v-btn>
              <v-text-field
                :rules="[rules.required]"
                v-model="data.username"
                label="用户名"
                required
                spellcheck="false"
              ></v-text-field>
              <v-text-field
                v-model="data.password"
                label="密码"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-select
                :rules="[rules.required]"
                v-model="data.driver"
                label="驱动类"
                :items="drivers"
                required
              ></v-select>

              <v-divider />
              <div class="d-flex justify-space-between mt-2">
                <v-btn type="reset" class="pl-4">取消</v-btn>
                <v-btn
                  type="submit"
                  :disabled="!valid"
                  class="bg-primary"
                  @click="save"
                  >保存</v-btn
                >
              </div>
            </v-form>
          </v-sheet>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import DataSourcesService from "@/services/datasources";
import { DataSource, type Toast } from "@/types";
import { useRouter, useRoute } from "vue-router";
import ToasInfo from "@/components/ToastInfo.vue";

const data = ref<DataSource>({
  no: "",
  name: "",
  url: "",
  username: "",
  password: "",
  driver: ""
} as DataSource);
const route = useRoute();
const router = useRouter();
const connFlag = ref<string>();
const valid = ref<boolean>(false);
const showPassword = ref<boolean>(false);

const drivers = ref<Array<string>>([
  "com.mysql.jdbc.Driver",
  "com.mysql.cj.jdbc.Driver",
  "org.postgresql.Drive",
  "oracle.jdbc.OracleDriver",
  "io.trino.jdbc.TrinoDriver",
  "com.clickhouse.jdbc.ClickHouseDriver",
  "io.prestosql.jdbc.PrestoDriver",
  "com.microsoft.sqlserver.jdbc.SQLServerDriver",
  "org.apache.hive.jdbc.Hive2Driver"
]);

const rules = ref({
  required: value => !!value || "Field is required",
  validJdbcUrl: value =>
    value.startsWith("jdbc:") || "URL must start with jdbc:",
  checkNo: value => existNo(value)
});

const toastCtl = ref<Toast>({
  showToast: false,
  msg: "",
  color: ""
});

const setToast = (msg: str, isError: boolean = true) => {
  toastCtl.value = {
    color: isError ? "error" : "success",
    showToast: true,
    msg: msg
  };
};

const testConn = () => {
  if (data.value.url == null || data.value.url == "") {
    alert("地址不能为空");
    return;
  }
  DataSourcesService.testConnection(data.value)
    .then(res => {
      if (res.code != 200) {
        connFlag.value = "mdi-close";
        // setToast(res.message, true);
        toastCtl.value = {
          color: "error",
          showToast: true,
          msg: res.message
        };
        // alert("连接失败:\n" + res.data.message);
      } else {
        connFlag.value = "mdi-check";
        setToast("连接成功", false);
      }
    })
    .catch(err => {
      connFlag.value = "mdi-close";
      setToast("连接失败" + err, true);
    });
};

async function existNo(no: string) {
  return new Promise(resolve => {
    if (route.params.id === "new" && DataSourcesService.exists(no)) {
      return resolve("编号已存在");
    }
    return resolve(true);
  });
}

const save = () => {
  if (valid.value == false) {
    setToast("请检查输入", true);
    return;
  }
  if (!existNo(data.value.no)) {
    return;
  }

  DataSourcesService.save(data.value)
    .then(res => {
      if (res.code == 201) {
        toastCtl.value = {
          color: "success",
          showToast: true,
          msg: "保存成功"
        };
        // Delay the redirection to allow the toast message to be visible
        setTimeout(() => {
          router.push("/admin/data_sources");
        }, 1000);
        // alert("保存失败:\n" + res.data.message);
      } else {
        toastCtl.value = {
          color: "error",
          showToast: true,
          msg: "保存失败: " + res.message
        };
        // router.push("/admin/data_sources");
      }
    })
    .catch(err => {
      toastCtl.value = {
        color: "error",
        showToast: true,
        msg: "保存失败" + err
      };
    });
};

onMounted(() => {
  if (route.params.id === "new") {
    // create new data source
    console.log("create a new data source");
  } else {
    DataSourcesService.get(route.params.id)
      .then(res => (data.value = res))
      .catch(err =>
        alert("failed to get data source with id: " + route.params.id + err)
      );
  }
});
</script>
