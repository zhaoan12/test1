<template>
  <div>
      <div id="cropper-wrapper">
          <cropper
          id="cropper"
    ref="cropper"
          :src="img"
          :stencil-component="stencilComponent"
          :stencil-props="cropperProps" />
          <input class='cropper-button' type='submit' value='CANCEL' @click.prevent='handleCancel'/>
          <input class='cropper-button yellow-button' type='submit' value='CONFIRM' @click.prevent='handleConfirm'/>
      </div>
  </div>
</template>

<script>
  import { Cropper } from 'vue-advanced-cropper';
  import 'vue-advanced-cropper/dist/style.css';
  export default {
      name: "imageCropper",
      props: {
          img: {
              type: String
          },
          imgType: {
              type: String
          },
          stencilComponent: {
              type: String
          },
          cropperProps: {
              type: Object
          },
      },
      components: {
          Cropper,
      },
      data() {
          return {
              croppedImg: "",
          }
      },
      methods: {
          handleCancel: function() {
              this.$emit('cropCanceled');
          },

          handleConfirm: function() {
              const { canvas } = this.$refs.cropper.getResult();
              canvas.toBlob((blob) => {
                  this.$emit('cropConfirmed', blob);
              }, this.imgType);
          }
      },
      destroyed() {   // Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
          if (this.img) {
              URL.revokeObjectURL(this.img);
          }
      }
  }
</script>

<style>
#cropper-wrapper {
  width: 60%;
height: 60%;
  margin-left: 20%;
  margin-top: 120px;
}

#cropper {
  width: 100%;
  height: 100%;
background: #DDD;
}

.cropper-button {
  position: relative;
  width: 45%;
  height: 40px;
  margin-top: 20px;
  border-radius: 5px;
  cursor: pointer
}

.yellow-button {
  margin-left: 9%;
  background: #E39E4D;
}
</style>
