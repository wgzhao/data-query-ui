<template>
    <div>
        <v-card>
            <v-card-title>关联查询配置</v-card-title>
            <v-card-text>
                <div v-if="loadingQueryConfigs" class="d-flex justify-center my-5">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </div>
                <div v-else>
                    <div class="mb-4 d-flex align-center">
                        <v-text-field v-model="queryConfigSearch" label="搜索查询配置" density="compact" hide-details
                            variant="outlined" clearable prepend-inner-icon="mdi-magnify" class="mb-2" />
                        <v-btn color="primary" size="small" variant="outlined" prepend-icon="mdi-plus" class="ml-3 mb-2"
                            @click="openNewQueryConfigDialog">
                            新增查询配置
                        </v-btn>
                    </div>

                    <v-alert v-if="queryConfigsError" type="error" density="compact" variant="tonal" class="mb-3">
                        {{ queryConfigsError }}
                    </v-alert>

                    <v-data-table v-model="selectedQueryConfigs" :headers="queryConfigHeaders" :items="allQueryConfigs"
                        :search="queryConfigSearch" item-value="id" density="compact" class="elevation-1" show-select
                        return-object>
                        <template v-slot:item.description="{ item }">
                            <div class="text-truncate" style="max-width: 200px;" :title="item.description">
                                {{ item.description }}
                            </div>
                        </template>
                    </v-data-table>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" variant="text" @click="queryConfigsDialog = false">
                    取消
                </v-btn>
                <v-btn color="primary" variant="text" @click="saveQueryConfigRelations" :loading="savingRelations"
                    :disabled="loadingQueryConfigs || savingRelations">
                    保存
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- 新增查询配置对话框 -->
        <!-- <v-dialog v-model="newQueryConfigDialog" max-width="800">
            <v-card>
                <v-card-title>新增查询配置</v-card-title>
                <v-card-text>
                    <v-form ref="queryConfigForm" @submit.prevent="saveNewQueryConfig">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newQueryConfig.name" label="名称" required
                                    :rules="[v => !!v || '请输入名称']" variant="outlined" density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="newQueryConfig.selectId" label="查询ID" required
                                    :rules="[v => !!v || '请输入查询ID']" variant="outlined" density="comfortable" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="newQueryConfig.description" label="描述" variant="outlined" rows="2"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="newQueryConfig.dataSource" :items="dataSources" item-title="name"
                                    item-value="no" label="数据源" required :rules="[v => !!v || '请选择数据源']"
                                    variant="outlined" density="comfortable" />
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-checkbox v-model="newQueryConfig.enabled" label="启用" hide-details
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="newQueryConfig.querySql" label="SQL查询语句" required
                                    :rules="[v => !!v || '请输入SQL查询语句']" variant="outlined" rows="5"
                                    density="comfortable" />
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="newQueryConfig.note" label="备注" variant="outlined" rows="2"
                                    density="comfortable" />
                            </v-col>
                        </v-row>
                    </v-form>

                    <v-alert v-if="newQueryConfigError" type="error" density="compact" variant="tonal" class="mt-3">
                        {{ newQueryConfigError }}
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="secondary" variant="text" @click="newQueryConfigDialog = false">
                        取消
                    </v-btn>
                    <v-btn color="primary" variant="text" @click="saveNewQueryConfig" :loading="savingNewQueryConfig"
                        :disabled="savingNewQueryConfig">
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import SignService from "@/services/sign";

const props = defineProps<{
    appId: string;
}>();


const relations = ref([]);
const queryConfigSearch = ref("");
const loadingQueryConfigs = ref(false);
const savingRelations = ref(false);
const queryConfigsError = ref("");
const allQueryConfigs = ref<QueryConfig[]>([]);

// 新增查询配置相关
const newQueryConfigDialog = ref(false);
const queryConfigForm = ref(null);

const savingNewQueryConfig = ref(false);
const newQueryConfigError = ref("");

const queryConfigHeaders = ref([
  { title: "ID", key: "id", width: "15%" },
  { title: "名称", key: "name", width: "30%" },
  { title: "描述", key: "description", width: "55%" },
]);

function getQueryConfigSignByAppId(appId: string) {
    try {

        // 获取当前签名已关联的查询配置
        SignService.getSignQueryRelations(appId).then(res => {
            relations.value = res.data;
        })

    } catch (err: any) {
        queryConfigsError.value = `加载数据失败: ${err.message}`;
        console.error("Error loading query configs:", err);
    } finally {
        loadingQueryConfigs.value = false;
    }
    // const relatedIds = relations.data || [];

    // // 根据ID找到完整的查询配置对象并设置为已选择
    // selectedQueryConfigs.value = allQueryConfigs.value.filter(config => 
    //   relatedIds.includes(config.id)
}

const saveQueryConfigRelations = async () => {
    savingRelations.value = true;
    queryConfigsError.value = "";

    try {
        const queryConfigIds = selectedQueryConfigs.value.map(item => item.id);
        await SignService.updateSignQueryRelations(currentSignAppId.value, queryConfigIds);
        queryConfigsDialog.value = false;
        alert("关联关系已更新");
    } catch (err: any) {
        queryConfigsError.value = `保存失败: ${err.message}`;
        console.error("Error saving query config relations:", err);
    } finally {
        savingRelations.value = false;
    }
};



const openNewQueryConfigDialog = async () => {
    newQueryConfigDialog.value = true;
    newQueryConfigError.value = "";

    // 重置表单
    Object.keys(newQueryConfig).forEach(key => {
        if (key === 'enabled') {
            newQueryConfig[key] = true;
        } else if (key === 'enableCache') {
            newQueryConfig[key] = false;
        } else if (key === 'cacheTime') {
            newQueryConfig[key] = 0;
        } else {
            newQueryConfig[key] = '';
        }
    });

    try {
        // 加载数据源列表
        const response = await DataSourceService.list();
        dataSources.value = response.data || [];
    } catch (err: any) {
        newQueryConfigError.value = `加载数据源失败: ${err.message}`;
        console.error("Error loading data sources:", err);
    }
};

const saveNewQueryConfig = async () => {
    // 表单验证
    const form = queryConfigForm.value as any;
    if (form && !form.validate().valid) {
        return;
    }

    savingNewQueryConfig.value = true;
    newQueryConfigError.value = "";

    try {
        // 保存新的查询配置
        const response = await QueryConfigService.save(newQueryConfig);
        const newConfig = response.data;

        // 更新查询配置列表
        allQueryConfigs.value = [...allQueryConfigs.value, newConfig];

        // 自动选中新创建的查询配置
        selectedQueryConfigs.value = [...selectedQueryConfigs.value, newConfig];

        // 关闭对话框
        newQueryConfigDialog.value = false;

    } catch (err: any) {
        newQueryConfigError.value = `保存失败: ${err.message}`;
        console.error("Error saving new query config:", err);
    } finally {
        savingNewQueryConfig.value = false;
    }
};

onMounted(() => {
    getQueryConfigSignByAppId(props.appId);
});
</script>