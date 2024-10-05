/* eslint-disable no-console */
import { LitElement, html, css } from 'lit';
import { asyncFetch, measCat } from '../core/hook.js';

export class NewskySelectMeas extends LitElement {
  static properties = {
    defaultValue: { type: String, attribute: 'default-value' },
    defaultProductUrl: { type: String },
    initialUrl: { type: String },
    queryUrl: { type: String },
    categoryUrl: { type: String },
    selectedProduct: { type: Object },
    productData: { type: Array },
    categoryId: { type: String },
    categoryName: { type: String },
    fetchType: { type: String },
    query: { type: String },
    catRaw: { type: Array },
  };

  static styles = css`
    .hidden {
      display: none !important;
    }
  `;

  constructor() {
    super();
    if (!this.defaultValue) this.defaultValue = '';
    if (this.defaultValue) {
      this.makeUrl();
    } else {
      this.defaultProductUrl = '';
      this.initialUrl = '';
    }

    this.categoryId = '';
    this.fetchType = 'category';
    this.query = '';
    this.productData = [];
    this.categoryName = '';
  }

  makeUrl() {
    this.defaultProductUrl = `/product-service/Measurement/oneForSelect/${this.defaultValue}`;
    this.initialUrl = `/product-service/Measurement/firstCall/${this.defaultValue}`;
    // console.log('default Url: ', this.defaultProductUrl); // it worked
  }

  async fetchDefaultProduct() {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        this.defaultProductUrl,
        window.token,
        window.username,
      );
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const data = await response.json();
      if (data) {
        this.selectedProduct = { id: data.id, name: data.nameStr };
        this.categoryId = data.extraCategoryID;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchProductList(url) {
    try {
      const response = await asyncFetch(
        'GET',
        window.sqlHost,
        url,
        window.token,
        window.username,
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response.json();
      if (data)
        this.productData = data.map(item => ({
          id: item.id,
          name: item.nameStr,
        }));
      // console.log('product data: ', this.productData);
    } catch (e) {
      console.log(e);
    }
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('categoryId')) {
      if (this.categoryId) {
        const xx = measCat.find(
          element =>
            element.value.toString().toLowerCase() ===
            this.categoryId.toLowerCase(),
        );
        this.categoryName = xx.name;
      }
    }

    if (changedProperties.has('defaultValue')) {
      this.loadDefault();
    }
  }

  loadDefault() {
    if (this.defaultValue) {
      this.makeUrl();
      this.fetchDefaultProduct();
      this.fetchProductList(this.initialUrl);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadDefault();
    // this.fetchAllCat();
  }

  firstUpdated() {
    const dropdown = this.shadowRoot.querySelector('.w3-dropdown-hover');
    if (dropdown) {
      dropdown.addEventListener('mouseenter', () => {
        const dropdownContent = this.shadowRoot.querySelector(
          '.w3-dropdown-content',
        );
        if (dropdownContent) {
          // console.log("Cos chay chuot")
          dropdownContent.classList.remove('hidden'); // Show dropdown on hover
        }
      });
    }
  }

  async treeViewClick(event) {
    // console.log(event); // it worked
    try {
      this.categoryId = event.value.toString();
      this.fetchType = 'category';
      // this.categoryName = event.detail.data.catName;

      this.fetchProductList(
        `/product-service/Measurement/byCategoryID/${event.value}`,
      );

      const xx = this.shadowRoot.querySelector('.w3-dropdown-content');
      xx.classList.add('hidden');
    } catch (error) {
      console.log(error);
    }
  }

  productSelected(event) {
    // console.log(event.detail);
    this.selectedProduct = { id: event.detail.id, name: event.detail.name };
    // console.log("selected product: ", this.selectedProduct);
    this.dispatchEvent(
      new CustomEvent('meas-select', { detail: this.selectedProduct }),
    );
  }

  execQuery(event) {
    this.query = event.detail;
    this.fetchType = 'query';
    this.fetchProductList(
      `/product-service/Measurement/byNameStr/${this.query}`,
    );
    // console.log('to query: ', event.detail);
  }

  execRefresh(event) {
    if (this.fetchType === 'category') {
      this.fetchProductList(
        `/product-service/Measurement/byCategoryID/${this.categoryId}`,
      );
    }

    if (this.fetchType === 'query') {
      this.fetchProductList(
        `/product-service/Measurement/byNameStr/${this.query}`,
      );
    }
    // console.log('To Refresh: ', event.detail);
  }

  /**
    <div class="w3-container">
      <newsky-select-meas-cat
      @meas-cat-change=${this.treeViewClick}
    ></newsky-select-meas-cat>
    </div>
  */
  render() {
    return html`
      <link href="https://www.w3schools.com/w3css/4/w3.css" rel="stylesheet" />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        rel="stylesheet"
      />
      <div class="w3-dropdown-hover">
        Đơn vị tính (${this.categoryName})
        <div class="w3-dropdown-content w3-card-4">
          <div class="w3-bar-block">
            ${measCat.map(
              item => html`
                <a
                  href="#"
                  class="w3-bar-item w3-button"
                  @click=${() => this.treeViewClick(item)}
                  >${item.name}</a
                >
              `,
            )}
          </div>
        </div>
      </div>
      <newsky-autocomplete
        .suggestions=${this.productData}
        .defaultValue=${this.defaultValue}
        @selection-changed=${this.productSelected}
        @launch-query=${this.execQuery}
        @launch-refresh=${this.execRefresh}
      >
      </newsky-autocomplete>
    `;
  }
}
