import { LightningElement,track} from 'lwc';
import getPostalDetails from '@salesforce/apex/PostOfficeDetailsApiApexClass.postOfficeByPincode';
import getBranchDetails from '@salesforce/apex/PostOfficeDetailsApiApexClass.postOfficeByBranchName';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class PostOfficeApiLWC extends LightningElement {

    @track postalDetails = [];
    showData = false;
    showModal = false;
    @track currentStep;
    @track value = '';
    Step1 = false;
    Step2 = false;
    Step3 = false;
    showPrevious = false;
    showClose = false;
    showNext = false;

    options = [
        { label: 'PinCode Enter', value: 'Pin' },
        { label: 'BranchName Enter', value: 'Branch' }
    ];

    handleChange(event) {
        this.value = event.detail.value; 
        console.log('Selected:', this.value);
    }
    
    handleClick(){
        this.showModal = true;
        this.currentStep = "1";
        this.Step1 = true;
        this.showNext = true;
    }

    handleClose(){
        this.showModal = false;
        this.value = '';
        this.Step1 = false;
        this.Step2 = false;
        this.Step3 = false;
        this.showPrevious = false;
        this.showNext = false;
        this.showData = false;
        this.showModal = false;
        this.showClose = false;
    }

    get isPin() {
        return this.value == 'Pin';
    }

    get isBranch() {
        return this.value == 'Branch';
    }


    columnsList = [{label:'Name', fieldName:'Name', type:'text'},
        {label:'PINCode', fieldName:'PINCode', type:'text'},
        {label:'BranchType', fieldName:'BranchType', type:'text'},
        {label:'Circle', fieldName:'Circle', type:'text'},
        {label:'District', fieldName:'District', type:'text'},
        {label:'Division', fieldName:'Division', type:'text'},
        {label:'Region', fieldName:'Region', type:'text'},
        {label:'State', fieldName:'State', type:'text'},
        {label:'Country', fieldName:'Country', type:'text'}];



    handleNext(){
        console.log(this.value);
        if(this.value ==''){
            this.dispatchEvent(
                new ShowToastEvent({
                    message: 'Please Select Choice!...', 
                    variant : 'error'         
                })
            )
            return;
        }

        this.showPrevious = true;      
        let step = parseInt(this.currentStep, 10);
        if(step < 3){
            this.currentStep = (step + 1).toString();
        }

        if(this.currentStep === "2"){
            this.Step1 = false;  
            this.Step2 = true;
            this.Step3 = false;  
            this.showNext = true;
            this.showClose = false;
        }

        console.log(this.Step1 + ' '+ this.Step2);
        console.log(JSON.stringify(this.value));


        if(this.currentStep === "3"){
            
            if(this.value == 'Pin' && this.Step2){
                console.log('Happy Empty Check');
                let postalCode = this.refs.post;
                console.log(postalCode);
                if(!postalCode || !postalCode.value){
                        this.dispatchEvent(
                            new ShowToastEvent({
                                message: 'Please Enter Data!...', 
                                variant : 'warning'         
                            })
                        )
                        return;
                    }
            }

            if(this.value == 'Branch' && this.Step2){
                let branchName = this.refs?.bran;
                if(!branchName?.value){
                    this.dispatchEvent(
                        new ShowToastEvent({
                            message: 'Please Enter Data!...', 
                            variant : 'warning'         
                        })
                    )
                    return;
                }
            }

            this.Step2 = false;
            this.Step3 = true;
            this.showClose = true;
            this.showNext = false;
            if(this.value == 'Pin'){
                this.handlePostalCode();
            }
            if(this.value == 'Branch'){
                this.handleBranchCode();
            }
        }
    }

    handlePrevious(){
        let step = parseInt(this.currentStep, 10);
        if(step > 1){
            this.currentStep = (step - 1).toString();
        }

        if(this.currentStep == "1"){
            this.Step1 = true;
            this.Step2 = false;
            this.Step3 = false;
        }

        if(this.currentStep == "2"){
            this.Step2 = true;
            this.Step1 = false;
            this.Step3 = false;
            this.showNext = true;
            this.showClose = false;
            this.postalDetails = [];
        }
    }

    handlePostalCode(){
        console.log('Enter Pin');
        let postalCode = this.refs.post.value;
        if(postalCode!=''){
            console.log('calling apex');
            getPostalDetails({pincode : postalCode})
            .then(result =>{
                this.postalDetails = result.map((item, index) => ({
                    ...item,
                    id: `item-${index}`,
                    isActive: index === 0
                }));
                if(this.postalDetails && this.postalDetails.length > 0){
                    this.showData = true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!',
                            message: 'Fetched Data Successful!', 
                            variant : 'success'         
                        })
                    )
                }else{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Warning!',
                            message: 'No Data Found!', 
                            variant : 'warning'         
                        })
                    )
                }
            }).catch(error =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: error, 
                        variant : 'error'         
                    })
                )
            })
        }
    }

    handleBranchCode(){
        console.log('Enter Branch');
        let branchName = this.refs.bran.value;
        if(branchName!=''){
            getBranchDetails({BranchName : branchName})
            .then(result =>{
                this.postalDetails = result;
                if(this.postalDetails && this.postalDetails.length > 0){
                    this.showData = true;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!',
                            message: 'Fetched Data Successful!', 
                            variant : 'success'         
                        })
                    )
                }else{
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Warning!',
                            message: 'No Data Found!', 
                            variant : 'warning'         
                        })
                    )
                }
            }).catch(error =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: error, 
                        variant : 'error'         
                    })
                )
            })
        }
    }


    currentSlide = 0;

    nextSlide() {
        // Set current slide inactive
        this.postalDetails = this.postalDetails.map((item, index) => ({
            ...item,
            isActive: index === (this.currentSlide + 1) % this.postalDetails.length
        }));
        console.log(JSON.stringify(this.postalDetails));
        // Move to next index
        this.currentSlide = (this.currentSlide + 1) % this.postalDetails.length;
    }

    // Show previous slide
    prevSlide() {
        // Calculate previous index
        const prevIndex =
            (this.currentSlide - 1 + this.postalDetails.length) % this.postalDetails.length;

        // Update array with active slide
        this.postalDetails = this.postalDetails.map((item, index) => ({
            ...item,
            isActive: index === prevIndex
        }));

        // Update currentSlide
        this.currentSlide = prevIndex;
    }
}