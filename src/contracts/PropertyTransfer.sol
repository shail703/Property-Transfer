pragma solidity 0.5.0;

contract PropertyTransfer {

    address public DA;
    uint256 public totalNoOfProperty; 
    
    constructor ()public {
        DA = msg.sender; 
    }
    
    modifier onlyOwner(){
        require(msg.sender == DA);
        _;
    }
    
    struct Property{
        string name;
        bool isSold;
    }
    
    mapping(address => mapping(uint256=>Property)) public  propertiesOwner; 
    mapping(address => uint256) public individualCountOfPropertyPerOwner;
    
    event PropertyAlloted(address indexed _verifiedOwner, uint256 indexed  _totalNoOfPropertyCurrently, string _nameOfProperty, string _msg);
    event PropertyTransferred(address indexed _from, address indexed _to, string _propertyName, string _msg);
    
    function getPropertyCountOfAnyAddress(address _ownerAddress) public view returns (uint256){
        uint count=0;
        for(uint i =0; i<individualCountOfPropertyPerOwner[_ownerAddress];i++){
            if(propertiesOwner[_ownerAddress][i].isSold != true)
            count++;
        }
        return count;
    }
    
    function allotProperty(address _verifiedOwner, string memory _propertyName) public onlyOwner
    {
        propertiesOwner[_verifiedOwner][individualCountOfPropertyPerOwner[_verifiedOwner]++].name = _propertyName;
        totalNoOfProperty++;
        emit PropertyAlloted(_verifiedOwner,individualCountOfPropertyPerOwner[_verifiedOwner], _propertyName, "property allotted successfully");
    }
    
    /// check whether the owner have the said property or not. if yes, return the index
    function isOwner(address _checkOwnerAddress, string memory _propertyName) public view returns (uint){
        uint i ;
        bool flag ;
        for(i=0 ; i<individualCountOfPropertyPerOwner[_checkOwnerAddress]; i++){
            if(propertiesOwner[_checkOwnerAddress][i].isSold == true){
                break;
            }
         flag = stringsEqual(propertiesOwner[_checkOwnerAddress][i].name,_propertyName);
            if(flag == true){
                break;
            }
        }
        if(flag == true){
            return i;
        }
        else {
            return 999999999;
        }
        
    }
    
    function stringsEqual (string memory a1, string memory a2)public pure returns (bool){
            return keccak256(abi.encodePacked(a1)) == keccak256(abi.encodePacked(a2))? true:false;
    }
    
   
    function transferProperty (address _to, string memory _propertyName) public 
      returns (bool ,  uint )
    {
        uint256 checkOwner = isOwner(msg.sender, _propertyName);
        bool flag;

        if(checkOwner != 999999999 && propertiesOwner[msg.sender][checkOwner].isSold == false){
            /// step 1 . remove the property from the current owner and decrase the counter.
            /// step 2 . assign the property to the new owner and increase the counter
            propertiesOwner[msg.sender][checkOwner].isSold = true;
            propertiesOwner[msg.sender][checkOwner].name = "Sold";// really nice finding. we can't put empty string
            propertiesOwner[_to][individualCountOfPropertyPerOwner[_to]++].name = _propertyName;
            flag = true;
            emit PropertyTransferred(msg.sender , _to, _propertyName, "Owner has been changed." );
        }
        else {
            flag = false;
            emit PropertyTransferred(msg.sender , _to, _propertyName, "Owner doesn't own the property." );
        }
        return (flag, checkOwner);
    }

}
