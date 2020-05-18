<template>
  <div class="wrapper">
    <h2 class="content-title">用户列表</h2>
    <div class="box-table">
      <my-form :ref="searchForm.ref" :formConfig="searchForm"></my-form>
      <el-alert
        v-show='selectArr.length > 0'
        type="warning"
         close-text="清除所选"
         @close="clearAlert">
        <div slot='title' class='alert-title'>
          <i class='el-icon-info'></i>
          <span>已选择{{selectArr.length}}项</span>
        </div>
      </el-alert>
      <my-table
        :tableData="tableData"
        :ref="tableData.ref"
        :pageObj="pageObj"
        @pageChange="pageChange"
        @selectChange="selectData"
      ></my-table>
    </div>
    <el-dialog
      :title="dialogBox.isEdit ? '编辑用户' : '新增用户'"
      :visible.sync="dialogBox.boxShow"
      width="640px"
    >
      <my-form :ref="userForm.ref" :formConfig="userForm"> </my-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBox.boxShow = false">取 消</el-button>
        <el-button type="primary" @click="confirSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>

<script>
import MyTable from "@/components/MyTable";
import MyForm from "@/components/MyForm";
import Format from "@/utils/format.js";
export default {
  data() {
    const validatePwdCheck = (rule, value, callback) => {
      if (value === "" || value === undefined) {
        callback(new Error('请输入确认密码'));
      } else if (value.length < 6 || value.length > 16) {
        callback(new Error('确认密码字符长度为6-16个字符'));
      } else if (value != this.userForm.formModel.password) {
        callback(new Error('确认密码和密码不一致'));
      } else {
        callback();
      }
    }
    return {
      dialogBox: {
        boxShow: false,
        isEdit: false,
        detailItem: {}
      },
      selectArr: [],
      searchForm: {
        labelWidth: "50px",
        ref: "searchRef",
        inline: true,
        marginRight: "30px",
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: "220px",
            placeholder: "请输入姓名/电话",
            suffix: "el-icon-search",
            label: "用户",
            blur: this.getDataList
          }
        ],
        operate: [
          {
            name: '新增账号',
            marginLeft: '40px',
            handleClick: this.dataAdd
          }
        ],
        formModel: {
          name: ""
        }
      },
      pageObj: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      tableData: {
        ref: "table",
        selection: true,
        reserveSelection: true,
        dataList: [],
        columns: [
          {
            prop: "name",
            label: "账号名称"
          },
          {
            prop: "phone",
            label: "手机号"
          },
          {
            prop: "email",
            label: "邮箱"
          },
          {
            prop: "note",
            label: "备注",
            showTooltip: true
          },
          {
            prop: "role",
            label: "账号类型"
          },
          {
            prop: 'status',
            label: '状态',
            render: (h, params)=>{
              let status = params.row.status
              return h('span', {
                style: {
                  color: status == '1'?'#02BB00':'#909399'
                }
              },status == '1'?'启用':'禁用')
            }
          },
          {
            prop: "operate",
            align: "center",
            label: "操作",
            render: (h, params) => {
              return h(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }
                },
                [
                  h('div', {
                    style: {
                      padding: '0 15px',
                      color: '#408CEE',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.dialogBox.detailItem = params.row;
                        this.editData(params.row);
                      }
                    }
                  }, '编辑'),
                  h('div', {
                    style: {
                      padding: '0 15px',
                      color: '#FF5252',
                      cursor: 'pointer'
                    },
                    on: {
                      click: () => {
                        this.dataDel(params)
                      }
                    }
                  }, '删除')
                ]
              );
            }
          }
        ]
      },
      userForm: {
        labelWidth: "80px",
        ref: "userRef",
        labelPosition: "right",
        requiredAsterisk: true,
        marginRight: "10px",
        formItemList: [
          {
            type: "text",
            prop: "name",
            width: "450px",
            label: "账号名称",
            placeholder: "请输入账号名称"
          },
          {
            type: "password",
            prop: "password",
            width: "450px",
            label: "密码",
            hide: false,
            placeholder: "请输入密码"
          },
          {
            type: "password",
            prop: "confirPwd",
            width: '450px',
            label: "确认密码",
            hide: false,
            placeholder: "请确认密码"
          },
          {
            type: "text",
            prop: "phone",
            width: "450px",
            label: "手机号",
            placeholder: "请输入手机号"
          },
          {
            type: "text",
            prop: "email",
            width: "450px",
            label: "邮箱",
            placeholder: "请输入邮箱"
          },
          {
            type: "select",
            prop: "role",
            width: '450px',
            label: '角色',
            placeholder: "请选择角色",
            arrList: [
              {
                label: '超级管理员',
                value: '超级管理员'
              },
              {
                label: '管理员',
                value: '管理员'
              },
              {
                label: '普通用户',
                value: '普通用户'
              }
            ]
          },
          {
            type: "select",
            prop: "status",
            width: '450px',
            label: '状态',
            placeholder: "请选择状态",
            arrList: [
              {
                label: '启用',
                value: '1'
              },
              {
                label: '禁用',
                value: '0'
              }
            ]
          },
          {
            type: "textarea",
            prop: "note",
            width: "450px",
            label: "备注",
            placeholder: "请输入备注"
          }
        ],
        formModel: {
          name: "",
          password: "",
          confirPwd: "",
          phone: "",
          email: "",
          role: "",
          status: '1',
          note: ""
        },
        rules: {
          name: [
            {
              required: true,
              validator: Format.FormValidate.Form("账号名称").NoEmpty,
              trigger: "blur"
            }
          ],
          password: [
            {
              required: true,
              validator: Format.FormValidate.Form("密码").Password,
              trigger: "blur"
            }
          ],
          confirPwd: [
            { required: true, validator: validatePwdCheck, trigger: 'blur' }
          ],
          phone: [
            {
              required: true,
              validator: Format.FormValidate.Form("手机号码").Phone,
              trigger: "blur"
            }
          ],
          email: [
            {
              required: true,
              validator: Format.FormValidate.Form("邮箱").Email,
              trigger: "blur"
            }
          ],
          role: [
            {
              required: true,
              validator: Format.FormValidate.Form("角色").TypeSelect,
              trigger: "change"
            }
          ],
          status: [
            {
              required: true,
              validator: Format.FormValidate.Form("状态").TypeSelect,
              trigger: "change"
            }
          ]
        }
      }
    };
  },
  created() {},
  mounted() {
    this.getDataList()
  },
  methods: {
    // 数据列表查询
    getDataList(page) {
      let pageObj = this.pageObj;
      pageObj.currentPage = page === true ? pageObj.currentPage : 1;
      let formModel = this.searchForm.formModel;
      this.$api.tableList
        .accountList({
          pageNo: pageObj.currentPage,
          countPerPage: pageObj.pageSize,
          search: formModel.name
        })
        .then(res => {
          this.pageObj.total = res.count
          this.tableData.dataList = res.data
        })
    },
    // 勾选数据
    selectData(data) {
      this.selectArr = data;
    },
    // 清空勾选
    clearAlert(){
      this.selectArr = []
      this.$refs['table'].$refs['table'].clearSelection()
    },
    // 新增数据
    dataAdd() {
      if (this.$refs["userRef"]) {
        this.$refs["userRef"].$refs["userRef"].resetFields();
      }
      this.userForm.formItemList[1].hide = false
      this.userForm.formItemList[2].hide = false
      this.dialogBox.isEdit = false
      this.dialogBox.boxShow = true
    },
    //编辑数据
    editData(row) {
      this.dialogBox.isEdit = true;
      this.dialogBox.boxShow = true;
      this.$nextTick(()=>{
        if (this.$refs["userRef"]) {
          this.$refs["userRef"].$refs["userRef"].resetFields();
        }
        this.userForm.formItemList[1].hide = true
        this.userForm.formItemList[2].hide = true
        this.userForm.formModel = {
          name: row.name,
          password: "",
          confirPwd: "",
          phone: row.phone,
          email: row.email,
          role: row.role,
          status: row.status,
          note: row.note
        }
      })
    },
    // 新增或编辑数据确认
    confirSubmit() {
      this.$refs["userRef"].$refs["userRef"].validate(valid => {
        let dialogBox = this.dialogBox;
        let formModel = this.userForm.formModel;
        if (valid) {
           this.getDataList();
          // if (dialogBox.isEdit) {
          //   this.$api.account
          //     .accountUpdate({
          //       id: this.dialogBox.detailItem.id,
          //       name: formModel.name,
          //       phone: formModel.phone,
          //       email: formModel.email,
          //       note: formModel.note,
          //       status: formModel.status,
          //       roleId: formModel.role
          //     })
          //     .then(res => {
          //       let code = res.code;
          //       if (code === '10000') {
          //         this.dialogBox.boxShow = false;
          //         this.getDataList();
          //         this.$message.success("用户信息更新成功");
          //       }  else {
          //         this.$message.warning("用户信息更新失败");
          //       }
          //     })
          // } else {
          //   this.$api.account
          //     .accountAdd({
          //       name: formModel.name,
          //       password: formModel.password,
          //       phone: formModel.phone,
          //       email: formModel.email,
          //       note: formModel.note,
          //       status: formModel.status,
          //       roleId: formModel.role
          //     })
          //     .then(res => {
          //       let code = res.code;
          //       if (code === '10000') {
          //         this.dialogBox.boxShow = false;
          //         this.getDataList();
          //         this.$message.success("用户信息新增成功");
          //       } else {
          //         this.$message.warning("用户信息新增失败");
          //       }
          //     });
          // }
        } else {
          this.$message.warning("信息校验失败");
        }
      })
    },
    dataDel(params) {
      this.$confirm("此操作将删除该用户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.getDataList();
          this.$message.success("用户删除成功")
          // this.$api.account.accountDel(params.row.id).then(res => {
          //   let code = res.code;
          //   if (code === '10000') {
              
          //   } else {
          //     this.$message.warning("用户删除失败")
          //   }
          // })
        })
        .catch(() => {});
    },
    // 分页页数改变
    pageChange(page) {
      this.pageObj.currentPage = page;
      this.getDataList(true);
    }
  },
  components: {
    MyTable,
    MyForm
  },
  computed: {

  }
}
</script>
