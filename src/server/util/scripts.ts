export function countScript() {
    return `
    // parse string date
    ZonedDateTime parseDate(def dateStr) {
      return ZonedDateTime.ofInstant(Instant.parse(dateStr), TimeZone.getDefault().toZoneId());
    }
    int getWeekIndex(def date, def firstDayWeek){
        DayOfWeek dayOfWeek = DayOfWeek.valueOf(firstDayWeek);
        date = date.with(TemporalAdjusters.previousOrSame(dayOfWeek)).plusWeeks(1);
        return date.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    }
    // left pad array for trend;
    ArrayList leftPadArray(def arr,def padLength){
      def newArr = new def[padLength];
      def updatePos =padLength - arr.length;
      for(int i = 0;i < padLength;i++){
        def index =  i - updatePos;
        newArr[i] = 0;
        if(index >= 0){
          newArr[updatePos + index] = arr[index] 
        }
      }
      return new ArrayList(Arrays.asList(newArr));
    }
    
    def curDate= parseDate(params.update_at);
    def oldDate= parseDate(ctx._source.update_at);
    
    // get date
    def curYear = curDate.getYear();
    def oldYear = oldDate.getYear();
    def curMonth = curDate.getMonth();
    def oldMonth = oldDate.getMonth();
    def curDay = curDate.getDayOfMonth();
    def oldDay = oldDate.getDayOfMonth();
    
    def curWeekIndex = getWeekIndex(curDate,"MONDAY");
    def oldWeekIndex =  getWeekIndex(oldDate,"MONDAY");
    
    // do update date count
    ctx._source.package_name=params.package_name;
    ctx._source.total+=params.count;
   
    ctx._source.this_year= curYear == oldYear ? params.count + ctx._source.this_year : params.count;
    ctx._source.this_month= curYear == oldYear && curMonth == oldMonth ? params.count + ctx._source.this_month : params.count;
    
    def thisWeekCount = curYear == oldYear && curWeekIndex == oldWeekIndex ? params.count + ctx._source.this_week : params.count;
    ctx._source.this_week= thisWeekCount;
    
    // update versions
    for(key in params.versions.keySet()){
      def oldCount = ctx._source.versions[key];
      def newCount = params.versions[key];
      ctx._source.versions[key] = oldCount == null ? newCount : newCount + oldCount;
    }
    
    // update trend
    if(curYear != oldYear || curWeekIndex != oldWeekIndex){
      ctx._source.trend.add(params.count);
      ctx._source.trend = leftPadArray(ctx._source.trend,60);
    } else {
      def lastIndex = ctx._source.trend.length -1;
      def trend = ctx._source.trend.set(lastIndex,ctx._source.trend[lastIndex]+params.count);
      ctx._source.trend=leftPadArray(ctx._source.trend,60);
    }
    
    ctx._source.update_at = params.update_at;    
    
    `;
}

export const INDEX_MAPPING = {
    properties: {
        package_name: {
            type: 'text',
            fields: {
                keyword: {
                    type: 'keyword',
                },
            },
        },
        this_month: {
            type: 'long',
        },
        this_week: {
            type: 'long',
        },
        this_year: {
            type: 'long',
        },
        total: {
            type: 'long',
        },
        trend: {
            type: 'long',
        },
        update_at: {
            type: 'date',
        },
        versions: {
            type: 'flattened',
        },
    },
};
