// Storage Controller
const storageController = (function () {

})();

// Product Controller
const ProductController = (function () {

    //private
    const Product = function(id,name,price){
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products : [
            // {id:0, name: 'Monitör' , price: 100},
            // {id:1, name: 'Klavye' , price: 40},
        ],
        selectedProduct : null,
        totalPrice:0
    }

    //public
    return{
        getProducts : function() {
            return data.products;
        },
        getData : function() {
            return data;
        },
        addProduct : function(name,price){
            let id ;
            if(data.products.length > 0){
                id = data.products[data.products.length - 1].id+1 //data.length'ten  1 çıkartarak index numarasına ulaşırız. Bunun id bilgisine bir eklersek'te sonraki elemanı yazdırmış oluruz.
            }else{
                id = 0;
            }
            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        getTotal: function() {
            let total = 0;
            data.products.forEach((item) =>{
                total += item.price;
            })
            data.totalPrice = total;
            return data.totalPrice;
        },
        getProductById: function(id){
            let product = null;

            data.products.forEach(function(prd){
                if(prd.id == id){
                    product = prd;
                }
            })
            return product;
        },
        setCurrentProduct: function(product){
            data.selectedProduct = product;
        },
        getCurrentProduct: function(){
            return data.selectedProduct;
        },
        updateProduct : function(name,price){
            let product = null;
            data.products.forEach((prd) =>{
                if(prd.id == data.selectedProduct.id){
                    prd.name = name;
                    prd.price = parseFloat(price);
                    product = prd;
                }
            })
            return product;
        }
    }  

})();

// UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        addButton : ".addBtn",
        updateButton : ".updateBtn",
        cancelButton : ".cancelBtn",
        deleteButton : ".deleteBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        productCard: "#productCard",
        totalTl: "#total-tl",
        totalUsd: "#total-usd",
        productListItems : "#item-list tr", // ürün güncellemesi için edit yaptığımızda arka planda olan bg-warning'i silmek için tr'leri seçmemiz gerekiyor.
    }

    return{
        createProductList : function(products){
            let html = ""

            products.forEach(prd =>{
                html += `
                    <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td>${prd.price}</td>
                        <td class="text-end">
                        <i class="fas fa-edit bg-success p-2 rounded text-white edit-product"></i>
                        </td>
                    </tr>
                `
            });
                
            document.querySelector(Selectors.productList).innerHTML = html; //Eğer item-list'i birden fazla yerde kullanmak istersek ve id ismini değiştirmek istersek hepsini tek tek değiştirmek yerine  yukarıda tanımlamış olduğumuz product list üzerinden tek seferde bütün değişikliği yapabiliriz.
        },
        getSelectors : function(){
            return Selectors;
        },
        addProduct : function(prd){
            document.querySelector(Selectors.productCard).style.display="block";
            var item = `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price}</td>
                    <td class="text-end">
                        <i class="fas fa-edit bg-success p-2 rounded text-white edit-product"></i>
                    </td>
                </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs : function(){
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard : function(){
            document.querySelector(Selectors.productCard).style.display = "none";
        },
        showTotal : function(total){
            document.querySelector(Selectors.totalUsd).textContent = total;
            document.querySelector(Selectors.totalTl).textContent = total*18.57;
        },
        addProductToForm : function(){

            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState : function(item){
            if(item){
                item.classList.remove("bg-warning");
            }
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display="inline";
            document.querySelector(Selectors.updateButton).style.display="none";
            document.querySelector(Selectors.deleteButton).style.display="none";
            document.querySelector(Selectors.cancelButton).style.display="none";
        },
        editState : function(tr){
            const parent = tr.parentNode;
            for(let i=0; i<parent.children.length;i++){
                parent.children[i].classList.remove("bg-warning");
            }
            tr.classList.add("bg-warning");
            document.querySelector(Selectors.addButton).style.display="none";
            document.querySelector(Selectors.updateButton).style.display="inline";
            document.querySelector(Selectors.deleteButton).style.display="inline";
            document.querySelector(Selectors.cancelButton).style.display="inline";
        },
        updateProduct : function(prd){
            let updatedItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach((item)=>{
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent = prd.name // 0. index id 1 index product name ikinci index ise product price 
                    item.children[2].textContent = prd.price + "$";
                    updatedItem = item;
                }
            });
            return updatedItem;
        }
    }

})();

// App Controller
const App = (function (ProductCtrl,UICtrl) {

    const UISelectors = UIController.getSelectors();

    //Load Event Listeners
    const loadEventListeners = function (){

        //add product event
        document.querySelector(UISelectors.addButton).addEventListener("click",productAddSubmit);

        //edit product click 
        document.querySelector(UISelectors.productList).addEventListener("click",productEditClick);

        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener("click",editProductSubmit);

        //cancel button click
        document.querySelector(UISelectors.cancelButton).addEventListener("click", cancelUpdate);

    }
    const productAddSubmit = (e) =>{
        e.preventDefault();
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;
        // console.log(productName,productPrice)
        if(productName!=="" && productPrice !==""){
            //add product
            const newProduct = ProductCtrl.addProduct(productName,productPrice);
            // console.log(newProduct);

            //add item to list
            UIController.addProduct(newProduct);

            //get total
            const total = ProductCtrl.getTotal();
            // console.log(total);

            //show total
            UICtrl.showTotal(total);

            //clearInputs
            UIController.clearInputs();
        }

    }
    const productEditClick = (e) =>{
        e.preventDefault(e);
        if(e.target.classList.contains('edit-product')){
            //console.log(e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent); // Edit butonuna tıkladığımız zaman ürünü editleyebilmek için id sine ulaşmamız gerekiyor. e.target ile <i> tag'ine ulaşırız. .parentNode ile parent elemanı olan td'ye ulaşırız. Ordanda 3 element önceye giderek id'nin bulunduğu elemente ulaşıp textContent ile id numarasını alırız.
            const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get selected produect
            const product = ProductCtrl.getProductById(id);
            // console.log(product);

            //set current product
            ProductCtrl.setCurrentProduct(product);

            //add product to UI
            UICtrl.addProductToForm();

            UICtrl.editState(e.target.parentNode.parentNode);
        }

    };
    const editProductSubmit = (e) => {
        e.preventDefault();
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== "" && productPrice !== ""){

            //update product
            const updatedProduct = ProductCtrl.updateProduct(productName, productPrice);

            //update ui
            let item = UICtrl.updateProduct(updatedProduct);

            //get total
            const total = ProductCtrl.getTotal();

            //show total
            UICtrl.showTotal(total);

            UICtrl.addingState(item);

        }
        // console.log(" UPDATE BUTTON CLİCK   ");
    };
    const cancelUpdate = (e) => {
        e.preventDefault();
        UICtrl.addingState();
    };

    return{
        init: function (){
            console.log("Starting App")
            UICtrl.addingState();
            const products  = ProductCtrl.getProducts();
            if(products.length == 0){
                UICtrl.hideCard();
            }else{
                // console.log(products);
                UICtrl.createProductList(products);
                //load event Listeners
            }
            loadEventListeners()
        }
    }

})(ProductController,UIController);

App.init();