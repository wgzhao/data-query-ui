<template>
  <div>
    <ToastInfo :toast="toastCtl" />
    <v-card flat class="mx-auto" rounded="lg" title="数据源详情">
      <v-divider />
      <v-card-text>
        <v-form ref="form" v-model="valid" fast-fail @submit.prevent>
          <v-row gutters="1" justify="start">
            <v-col align-self="center" cols="12" md="1">
              <v-label for="no" text="编号" />
            </v-col>
            <v-col align-self="center" cols="12" md="5">
              <v-text-field
                id="no"
                :rules="[rules.required, rules.checkNo]"
                v-model="data.no"
                required
                small
                spellcheck="false"
              ></v-text-field>
            </v-col>

            <v-col align-self="center" cols="12" md="1">
              <v-label for="name">名称</v-label>
            </v-col>
            <v-col align-self="center" cols="12" md="5">
              <v-text-field
                id="name"
                :rules="[rules.required]"
                v-model="data.name"
                required
                focused
                spellcheck="false"
              ></v-text-field>
            </v-col>
            <v-col align-self="center" cols="12" md="1">
              <v-label for="url">JDBC 地址</v-label>
            </v-col>
            <v-col align-self="center" cols="12" md="10">
              <v-text-field
                :rules="[rules.required, rules.validJdbcUrl]"
                v-model="data.url"
                required
                spellcheck="false"
                :append-inner-icon="connFlag"
              ></v-text-field>
            </v-col>
            <v-col align-self="center" cols="12" md="1">
              <v-btn button @click="testConn">测试</v-btn>
            </v-col>

            <v-col align-self="center" cols="12" md="1">
              <v-label for="username">用户名</v-label>
            </v-col>
            <v-col align-self="center" cols="12" md="5">
              <v-text-field
                id="username"
                :rules="[rules.required]"
                v-model="data.username"
                required
                focused
                spellcheck="false"
              ></v-text-field>
            </v-col>

            <v-col align-self="center" cols="12" md="1">
              <v-label for="password">密码</v-label>
            </v-col>
            <v-col align-self="center" cols="12" md="5">
              <v-text-field
                id="password"
                :rules="[rules.required]"
                v-model="data.paswword"
                required
                focused
                spellcheck="false"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
            </v-col>

            <v-col align-self="center" cols="12" md="1">
              <v-label for="driver">驱动类</v-label>
            </v-col>
            <v-col align-self="center" cols="12" md="11">
              <v-select
                id="driver"
                :rules="[rules.required]"
                v-model="data.driver"
                :items="drivers"
                required
              ></v-select>
            </v-col>

            <v-divider />

            <v-col align-self="center" cols="12" md="6">
              <v-btn type="reset" class="pl-4">取消</v-btn>
            </v-col>
            <v-col align-self="center" cols="12" md="6">
              <v-btn
                type="submit"
                :disabled="!valid"
                class="bg-primary"
                @click="save"
                >保存</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
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
