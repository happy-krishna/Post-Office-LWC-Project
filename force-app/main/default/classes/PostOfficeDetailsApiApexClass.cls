/**
* @File Name : PostOfficeDetailsApiApexClass.cls
* @Description :
* @Author :
* @Last Modified By :
* @Last Modified On : November 23, 2025
* @Modification Log :
*==============================================================================
* Ver | Date | Author | Modification
*==============================================================================
* 1.0 | November 23, 2025 |   | Initial Version
**/

public class PostOfficeDetailsApiApexClass {
    @AuraEnabled
    public static list<PostalResponseWrapper> postOfficeByPincode(string pincode){
        list<PostalResponseWrapper> postalList = new list<PostalResponseWrapper>();
        //list out endpoint
        string endpoint='https://api.postalpincode.in/pincode/';
        if(string.isNotBlank(pincode)){
            endpoint= endpoint+pincode;//https://api.postalpincode.in/pincode/560022
        }
        //instantiate http
        Http h=new Http();
        //craete request for your http api call
        HttpRequest hreq=new HttpRequest();
        hreq.setMethod('GET');
        hreq.setEndpoint(endpoint);
        hreq.setHeader('content-type','application/json');
        //invoke rest call with send method
        HttpResponse hresp = h.send(hreq);
        system.debug('***hresp'+hresp.getStatuscode());
        //if response is sucess then only pass response
        if(hresp.getStatusCode() == 200){
            JSONParser parser = JSON.createParser(hresp.getBody());
            parser.nextToken();
            
            while(parser.nextToken()!=NULL){
                if(parser.getCurrentToken()==JSONTOKEN.START_ARRAY){
                    while(parser.nextToken()!=NULL){
                        if(parser.getCurrentToken() == JSONTOKEN.START_OBJECT){
                        PostalResponseWrapper eachPostal = (PostalResponseWrapper)parser.readValueAs(PostalResponseWrapper.class);
                        eachPostal.PINCode = pincode;
                        PostalList.add(eachPostal);
                           
                        system.debug('eachPostal'+ eachPostal);
                    }
                   
                }
                
            }
            }      
            
        }
        system.debug('postalList'+postalList);
        return postalList;
    }
    
      @AuraEnabled
    public static list<PostalResponseWrapper> postOfficeByBranchName(string BranchName){
        list<PostalResponseWrapper> postalList = new list<PostalResponseWrapper>();
         // URL encode branch name
           if (String.isNotBlank(BranchName)) {
        BranchName = EncodingUtil.urlEncode(BranchName.trim(), 'UTF-8');
            }

        //list out endpoint
        string endpoint='https://api.postalpincode.in/postoffice/' + BranchName;
       
        //instantiate http
        Http h=new Http();
        //craete request for your http api call
        HttpRequest hreq=new HttpRequest();
        hreq.setMethod('GET');
        hreq.setEndpoint(endpoint);
        hreq.setHeader('content-type','application/json');
        //invoke rest call with send method
        HttpResponse hresp = h.send(hreq);
        system.debug('***hresp'+hresp.getStatuscode());
        //if response is sucess then only pass response
        if(hresp.getStatusCode() == 200){
            JSONParser parser = JSON.createParser(hresp.getBody());
            parser.nextToken();
            
            while(parser.nextToken()!=NULL){
                if(parser.getCurrentToken()==JSONTOKEN.START_ARRAY){
                    while(parser.nextToken()!=NULL){
                        if(parser.getCurrentToken() == JSONTOKEN.START_OBJECT){
                        PostalResponseWrapper eachPostal = (PostalResponseWrapper)parser.readValueAs(PostalResponseWrapper.class);
                        PostalList.add(eachPostal);
                           
                        system.debug('eachPostal'+ eachPostal);
                    }
                   
                }
                
            }
            }      
            
        }
        system.debug('postalList'+postalList);
        return postalList;
    }
        
    public class PostalResponseWrapper{
        @AuraEnabled
        public string Name;
        @AuraEnabled
        public string Description;
        @AuraEnabled
        public string PINCode;
        @AuraEnabled
        public string BranchType;
        @AuraEnabled
        public string DeliveryStatus;
        @AuraEnabled
        public string Circle;
        @AuraEnabled
        public string District;
        @AuraEnabled
        public string Division;
        @AuraEnabled
        public string Region;
        @AuraEnabled
        public string State;
        @AuraEnabled
        public string Country;
    }    

}