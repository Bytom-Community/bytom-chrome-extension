<style scoped>
.body {
    padding: 20px 15px;
}
input {
    width: 165px;
}
</style>

<template>
    <MenuPage title="导入账户">
        <div class="form-item">
            <input type="file" ref="file" @change="tirggerFile($event)">
        </div>
        <div class="btn bg-green" @click="recovery">从种子导入</div>
    </MenuPage>
</template>

<script>
import account from "@/models/account";
import getLang from "@/assets/language/sdk";
export default {
    name: "",
    data() {
        return {
            fileTxt: ""
        };
    },
    methods: {
        tirggerFile: function (event) {
            var reader = new FileReader();
            reader.onload = e => {
                this.fileTxt = e.target.result;
            };

            var file = event.target.files[0];
            reader.readAsText(file);
        },
        recovery: function () {
            account.restore(this.fileTxt).then(res => {
                console.log("recovery", res);
                this.$router.go(-1);
            }).catch(error => {
                this.$dialog.show({
                    body: getLang(error.message),
                });
            });
        }
    }
};
</script>