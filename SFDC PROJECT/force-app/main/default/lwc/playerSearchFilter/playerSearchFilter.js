import { LightningElement ,wire} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getObjectInfo,getPicklistValues } from 'lightning/uiObjectInfoApi';
import Cricketer_Object from '@salesforce/schema/Cricketers__c';
import Field from '@salesforce/schema/AccountHistory.Field';
import Nationality_Field from '@salesforce/schema/Cricketers__c.Nationality__c';

export default class PlayerSearchFilter extends NavigationMixin(LightningElement) {

    recordTypeId;
    picklistValue;
    optionsArray;
    selectedCricketerNationality='';
    selectedPlayerId;

    @wire(getObjectInfo,{objectApiName: Cricketer_Object})
    objectInfos({ data,error}){

        if(error){
            console.log('error:'+JSON.stringify(error))
        }
        else if(data){
            this.recordTypeId = data.defaultRecordTypeId;
            console.log('this.recordTypeId:'+JSON.stringify(this.recordTypeId))
        }
    }

    @wire(getPicklistValues,{recordTypeId: '$recordTypeId', fieldApiName: Nationality_Field})
    nationalityFieldValues({ data,error}){
        if(error){
            console.log('error:'+JSON.stringify(error))
        }
        else if(data){

            let arr=[];

            this.picklistValue = data.values;
            console.log('picklist data:'+JSON.stringify(this.picklistValue))

            this.picklistValue.forEach( element =>{
                arr.push( { label : element.value, value : element.value})
            })

            this.optionsArray = arr;
            console.log('this.optionarrayL:'+JSON.stringify(this.optionsArray))

        }

    }

    createCricketers(){

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes:{
                objectApiName: 'Cricketers__c',
                actionName: 'new'
            }
        })
    }

    handleOptionChange(event){

        this.selectedCricketerNationality = event.detail.value;
        console.log('this.selectedCricketerNationality: '+JSON.stringify(this.selectedCricketerNationality))

        this.template.querySelector('c-player-search-results').searchCricketer(this.selectedCricketerNationality);
    }

    handleCustomeEvent(event){
        this.selectedPlayerId = event.detail.playerId;
        console.log('this.selectedPlayerId in parent lwc:'+JSON.stringify(this.selectedPlayerId))
    }
}