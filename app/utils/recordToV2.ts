
export default function (oldRecord: Omit<InventoryRecord,"id"> | InventoryRecord) {
    let newRecord = {...oldRecord}
    if (!newRecord.units) return oldRecord
    if(newRecord.type && newRecord.type == "sell" ){
        newRecord.units = Math.abs(newRecord.units)*-1
    }

    return newRecord
  }
  