/* eslint-disable class-methods-use-this */
/* eslint-disable no-return-assign */
import { LitElement, html } from 'lit';
import { asyncFetch } from '../../core/hook.js';

export class NewProduct extends LitElement {
  static properties = {
    nameStr: { type: String },
    MeasID: { type: String },
    extraCategoryID: { type: String },
    minimumStock: { type: Number },
    mayBeBuy: { type: Boolean },
    mayBeSell: { type: Boolean },
    mayBeProduce: { type: Boolean },
    canSellWithOutStock: { type: Boolean },
    disContinue: { type: Boolean },
    classPriceID: { type: String },
    segmentID: { type: String },
    comment: { type: String },
    initStock: { type: Number },
    holdingStock: { type: Number },
    currentStock: { type: Number },
    warehouseId: { type: Number },
    catName: { type: String },
    productRel: { type: Array },
  };

  constructor() {
    super();
    this.nameStr = '';
    this.MeasID = '';
    this.extraCategoryID = '';
    this.minimumStock = 0;
    this.mayBeBuy = false;
    this.mayBeSell = false;
    this.mayBeProduce = false;
    this.canSellWithOutStock = false;
    this.disContinue = false;
    this.classPriceID = '';
    this.segmentID = '';
    this.comment = '';
    this.initStock = 0;
    this.currentStock = 0;
    this.holdingStock = 0;
    this.warehouseId = 1;
  }

  async saveProduct(event) {
    event.preventDefault();
    try {
      const response = await asyncFetch(
        'POST',
        window.sqlHost,
        `/product-service/product`,
        window.token,
        window.username,
        {
          nameStr: this.nameStr,
          MeasID: this.MeasID,
          extraCategoryID: this.extraCategoryID,
          minimumStock: this.minimumStock,
          mayBeBuy: this.mayBeBuy,
          mayBeSell: this.mayBeSell,
          mayBeProduce: this.mayBeProduce,
          canSellWithOutStock: this.canSellWithOutStock,
          disContinue: this.disContinue,
          classPriceID: this.classPriceID,
          segmentID: this.segmentID,
          comment: this.comment,
          initStock: this.initStock,
          holdingStock: this.holdingStock,
          currentStock: this.currentStock,
          warehouseId: this.warehouseId,
        },
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();

      if (data) {
        // this.saveProductRelation(data.id);
        const kk = this.shadowRoot.querySelector('newsky-manage-attribute');
        if (kk) {
          kk.persistData(data.id);
        }
        this.dispatchEvent(
          new CustomEvent('addnew-product', {
            bubbles: true,
            composed: true,
            detail: data, // { ...data, parentId: this.parentId },
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  cancelDetail(event) {
    event.preventDefault();
    this.dispatchEvent(
      new CustomEvent('cancel-detail', {
        bubbles: true,
        composed: true,
        detail: { back: 'showproduct' },
      }),
    );
  }

  measSelected(event) {
    this.MeasID = event.detail.id;
    // console.log('meas selected', event);
  }

  segmentSelected(event) {
    this.segmentID = event.detail.id;
    // console.log('segment selected', event);
  }

  classSelected(event) {
    this.classPriceID = event.detail.id;
    // console.log('class selected', event);
  }

  warehouseSelected(event) {
    console.log('warehouse selected', event.detail);
    this.warehouseId = event.detail;
  }

  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <div class="w3-row">
        <span class="w3-xlarge w3-text-indigo"
          >Thêm một sản phẩm ${this.catName}</span
        >
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m8">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            class="w3-input w3-border"
            .value=${this.nameStr}
            @input=${e => (this.nameStr = e.target.value)}
          />
        </div>
        <div class="w3-col m4" style="padding-left: 10px">
          <newsky-select-meas
            @meas-select=${this.measSelected}
          ></newsky-select-meas>
        </div>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m4">
          <newsky-select-segment
            @segment-select=${this.segmentSelected}
          ></newsky-select-segment>
        </div>
        <div class="w3-col m3" style="padding-left: 10px">
          <label>Số tồn kho tối thiểu</label>
          <input
            type="text"
            class="w3-input w3-border"
            .value=${this.minimumStock}
            @input=${e => (this.minimumStock = e.target.value)}
          />
        </div>
        <div class="w3-col m5" style="padding-left: 10px; padding-top: 24px">
          <input
            class="w3-check"
            type="checkbox"
            .checked=${this.canSellWithOutStock}
            @click=${() => {
              this.canSellWithOutStock = !this.canSellWithOutStock;
            }}
          />
          <label>Có thể bán mà không cần tồn kho</label>
        </div>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <div class="w3-col m4">
          <input
            class="w3-check"
            type="checkbox"
            .checked=${this.mayBeProduce}
            @click=${() => {
              this.mayBeProduce = !this.mayBeProduce;
            }}
          />
          <label>Có thể sản xuất</label>
        </div>
        <div class="w3-col m4" style="padding-left: 10px">
          <input
            class="w3-check"
            type="checkbox"
            .checked=${this.mayBeBuy}
            @click=${() => {
              this.mayBeBuy = !this.mayBeBuy;
            }}
          />
          <label>Có thể mua</label>
        </div>
        <div class="w3-col m4" style="padding-left: 10px">
          <input
            class="w3-check"
            type="checkbox"
            .checked=${this.mayBeSell}
            @click=${() => {
              this.mayBeSell = !this.mayBeSell;
            }}
          />
          <label>Có thể bán</label>
        </div>
      </div>
      <div class="w3-row" style="padding-top: 20px">
        <div class="w3-col m6">
          <newsky-select-class
            @class-select=${this.classSelected}
          ></newsky-select-class>
        </div>
        <div class="w3-col m6" style="padding-left: 10px">
          <label>Hiện đang lưu ở kho</label>
          <newsky-select-warehouse
            @warehouse-change=${this.warehouseSelected}
          ></newsky-select-warehouse>
        </div>
      </div>
      <div class="w3-row" style="padding-top: 20px">
        <div class="w3-col m6">
          <label>Tồn đầu kỳ</label>
          <input
            class="w3-input w3-border"
            type="text"
            .value=${this.initStock}
            @input=${e => (this.initStock = e.target.value)}
          />
        </div>
        <div class="w3-col m6" style="padding-left: 10px">
          <label>Nhu cầu sử dụng đầu kỳ</label>
          <input
            class="w3-input w3-border"
            type="text"
            .value=${this.initStock}
            @input=${e => (this.initStock = e.target.value)}
          />
        </div>
      </div>
      <div class="w3-row" style="padding-top: 20px">
        <label>Ghi chú</label>
        <textarea
          rows="4"
          type="text"
          class="w3-input w3-border"
          .value=${this.comment}
          @input=${e => (this.comment = e.target.value)}
        ></textarea>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <newsky-manage-attribute></newsky-manage-attribute>
      </div>
      <div class="w3-row" style="padding-top: 10px">
        <button
          class="w3-button w3-teal w3-round-xlarge"
          @click=${this.saveProduct}
        >
          Save
        </button>
        <button
          class="w3-button w3-khaki w3-round-xlarge"
          @click=${this.cancelDetail}
        >
          Cancel
        </button>
      </div>
    `;
  }
}
