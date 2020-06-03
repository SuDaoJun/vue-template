<template>
  <div class='slot-upload'>
    <div class="upload-square" v-if='type === "square"'>
      <el-upload class='upload-file' enctype='multipart/form-data' :accept="accept" :limit='limit' :multiple="multiple"
        :list-type="listType" :file-list="fileList" :before-upload='beforeUpload' :before-remove='beforeRemove'
        :on-exceed='handleExceed' action="">
        <i class="el-icon-plus avatar-uploader-icon" :style='{width: boxSize,height:boxSize,lineHeight:boxSize}'></i>
      </el-upload>
      <div class="file-progress" v-if='progressObj.show'>
        <el-progress :percentage="progressObj.percentage" :status="progressObj.percentage == 100?'success':'exception'">
        </el-progress>
      </div>
    </div>
    <div class="upload-avatar" v-else-if='type === "avatar"'>
      <el-upload class='avatar-slot' enctype='multipart/form-data' :accept="accept" :limit='limit' :multiple="multiple"
        :list-type="listType" :file-list="fileList" :before-upload='beforeUpload' :before-remove='beforeRemove'
        :on-exceed='handleExceed' action="">
        <slot :name="avatarSlot" v-if='avatarSlot' />
      </el-upload>
      <div class="file-progress" v-if='progressObj.show' :style='{width: progress.width,margin: progress.margin}'>
        <el-progress :percentage="progressObj.percentage" :status="progressObj.percentage == 100?'success':'exception'">
        </el-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    uploadType: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "square"
    },
    accept: {
      type: String,
      default: "image/gif,image/jpeg,image/jpg,image/png,image/svg"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: "text"
    },
    boxSize: {
      type: String,
      default: "128px"
    },
    resType: {
      type: String,
      default: "img"
    },
    limit: {
      type: Number,
      default: 1
    },
    fileList: {
      type: Array,
      default() {
        return [];
      }
    },
    fileSize: {
      type: Number,
      default: 5242880
    },
    progress: {
      type: Object,
      default() {
        return {};
      }
    },
    avatarSlot: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      progressObj: {
        show: false,
        percentage: 0
      }
    };
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.limit} 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
          fileResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          resolve(fileResult);
        };
      });
    },
    beforeUpload(file) {
      if (file.size > this.fileSize) {
        let sizeLimit = this.fileSize / 1024 / 1024;
        this.$message.warning(`大小限制在${sizeLimit}Mb以内`);
        return;
      }
      if (this.resType === "base64") {
        this.getBase64(file).then(resBase64 => {
          this.$emit("uploadEvent", resBase64);
        });
        return false;
      } else {
        this.progressObj.percentage = 0;
        this.progressObj.show = true;
        let fd = new FormData();
        fd.append("file", file);
        fd.append("type", this.uploadType);
        this.$api.upload
          .uploadFile(fd, upload => {
            let complete = ((upload.loaded / upload.total) * 100) | 0;
            this.progressObj.percentage = complete;
            if (this.progressObj.percentage == 100) {
              setTimeout(() => {
                this.progressObj = {
                  show: false,
                  percentage: 0
                };
              }, 1000);
            }
          })
          .then(res => {
            let code = res.code;
            if (code === "10000") {
              let fileData = res.data;
              this.$emit("uploadEvent", fileData[0]);
            } else {
              this.progressObj = {
                show: false,
                percentage: 0
              };
              this.$message.warning("文件上传失败");
            }
          });
        return false;
      }
    },
    beforeRemove(file, fileList) {
      if (file.status === "ready") {
        return true;
      } else {
        this.$emit("removeEvent", file);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.slot-upload {
  width: 100%;
  .upload-file {
    .el-upload {
      border: 1px dashed #9D9FA2;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #409eff;
      }
    }
    .avatar-uploader-icon {
      font-size: 20px;
      color: #8c939d;
      width: 128px;
      height: 128px;
      line-height: 128px;
      text-align: center;
    }
  }
  .file-progress {
    width: 400px;
    margin-top: 10px;
  }
}
</style>